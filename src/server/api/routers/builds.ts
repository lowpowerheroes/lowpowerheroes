import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { count, eq, ilike, lt, inArray } from "drizzle-orm";
import type { BuildWithImages } from "~/lib/types";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { builds, buildImages as imagesSchema } from "~/server/db/schema";
import { createBuildWithImages, uploadImages } from "~/server/services/build";
import { BUCKET_NAME, s3 } from "~/server/services/r2";
import { TRPCError } from "@trpc/server";

async function generateSignedUrlsForBuild(build: BuildWithImages) {
  for (const image of build.images) {
    const key = image.image_url.split("/").pop();
    if (!key || !process.env.R2_BUCKET_NAME) continue;

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    image.image_url = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }
}

export const buildRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        build_name: z.string(),
        build_description: z.string(),
        build_mods: z.array(z.string()),
        driver_description: z.string(),
        driver_name: z.string(),
        driver_nationality: z.string(),
        build_images: z
          .array(
            z.object({
              base64: z.string(),
              isPrimary: z.boolean().optional(),
            }),
          )
          .max(10, "Maximum 10 images allowed"),
      }),
    )
    .mutation(async ({ input }) => {
      await createBuildWithImages({
        build_name: input.build_name,
        build_description: input.build_description,
        build_mods: input.build_mods,
        driver_name: input.driver_name,
        driver_description: input.driver_description,
        build_images: input.build_images,
        driver_nationality: input.driver_nationality,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        build_name: z.string(),
        build_description: z.string(),
        build_mods: z.array(z.string()),
        driver_description: z.string(),
        driver_name: z.string(),
        driver_nationality: z.string(),
        build_images: z
          .array(
            z.object({
              id: z.string().optional(),
              base64: z.string().optional(),
              isPrimary: z.boolean().optional(),
            }),
          )
          .max(10, "Maximum 10 images allowed"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        // 1. Fetch the existing build with its images
        const existingBuild = await tx.query.builds.findFirst({
          where: eq(builds.build_id, input.id),
          with: { images: true },
        });

        if (!existingBuild) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Build not found.",
          });
        }

        // 2. Update the build's main text fields
        await tx
          .update(builds)
          .set({
            build_name: input.build_name,
            build_description: input.build_description,
            build_mods: input.build_mods,
            driver_name: input.driver_name,
            driver_description: input.driver_description,
            driver_nationality: input.driver_nationality,
            updatedAt: new Date(),
          })
          .where(eq(builds.build_id, input.id));

        // 3. Handle image deletions
        const incomingImageIds = input.build_images
          .map((img) => img.id)
          .filter((id): id is string => !!id);

        const imagesToDelete = existingBuild.images.filter(
          (img) => !incomingImageIds.includes(img.image_id),
        );

        if (imagesToDelete.length > 0) {
          const keysToDelete = imagesToDelete
            .map((img) => img.image_url.split("/").pop())
            .filter(Boolean);
          const deletePromises = keysToDelete.map((key) =>
            s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key })),
          );
          await Promise.all(deletePromises);
          await tx.delete(imagesSchema).where(
            inArray(
              imagesSchema.image_id,
              imagesToDelete.map((i) => i.image_id),
            ),
          );
        }

        // 4. Handle new image uploads
        const newImages = input.build_images.filter((img) => img.base64);
        if (newImages.length > 0) {
          await uploadImages(tx, input.id, newImages);
        }

        // 5. Handle primary image update
        const primaryImage = input.build_images.find((img) => img.isPrimary);
        if (primaryImage) {
          // Set all images for this build to not be primary
          await tx
            .update(imagesSchema)
            .set({ is_primary: false })
            .where(eq(imagesSchema.build_id, input.id));

          // If the primary image is an existing one, update it.
          // If it's a new one, its 'isPrimary' flag was already set during upload.
          if (primaryImage.id) {
            await tx
              .update(imagesSchema)
              .set({ is_primary: true })
              .where(eq(imagesSchema.image_id, primaryImage.id));
          }
        }
      });

      return { success: true };
    }),

  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.date().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 24;
      const { cursor } = input;

      const items = await ctx.db.query.builds.findMany({
        orderBy: (builds, { desc }) => [desc(builds.createdAt)],
        where: cursor ? lt(builds.createdAt, cursor) : undefined,
        limit: limit + 1,
        with: {
          images: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.createdAt;
      }

      await Promise.all(
        items.map((build) => generateSignedUrlsForBuild(build)),
      );

      return {
        items,
        nextCursor,
      };
    }),

  searchByName: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(24),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, page, limit } = input;

      if (!query.trim()) {
        return { builds: [], totalCount: 0 };
      }

      const whereCondition = ilike(builds.build_name, `%${query}%`);
      const offset = (page - 1) * limit;

      const [results, total] = await Promise.all([
        ctx.db.query.builds.findMany({
          where: whereCondition,
          orderBy: (builds, { desc }) => [desc(builds.createdAt)],
          with: {
            images: true,
          },
          limit,
          offset,
        }),
        ctx.db.select({ value: count() }).from(builds).where(whereCondition),
      ]);

      const totalCount = total[0]?.value ?? 0;

      for (const build of results) {
        await generateSignedUrlsForBuild(build);
      }

      return { builds: results, totalCount };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const build = await ctx.db.query.builds.findFirst({
        where: eq(builds.build_id, input.id),
        with: {
          images: true,
        },
      });

      if (!build) {
        return null;
      }

      await generateSignedUrlsForBuild(build);

      return build;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const build = await ctx.db.query.builds.findFirst({
        where: eq(builds.build_id, input.id),
        with: {
          images: true,
        },
      });

      if (!build) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Build not found." });
      }

      if (build.images && build.images.length > 0) {
        const deletePromises = build.images.map((image) => {
          const key = image.image_url.split("/").pop();
          if (!key) return Promise.resolve();
          return s3.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key,
            }),
          );
        });
        await Promise.all(deletePromises);
      }

      return ctx.db.delete(builds).where(eq(builds.build_id, input.id));
    }),
});
