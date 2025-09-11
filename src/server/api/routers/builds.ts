import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { count, eq, ilike } from "drizzle-orm";
import type { BuildWithImages } from "~/lib/types";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { builds } from "~/server/db/schema/builds";
import { createBuildWithImages } from "~/server/services/build";
import { s3 } from "~/server/services/r2";

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

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const builds = await ctx.db.query.builds.findMany({
      orderBy: (builds, { desc }) => [desc(builds.createdAt)],
      with: {
        images: true,
      },
    });

    for (const build of builds) {
      await generateSignedUrlsForBuild(build);
    }

    return builds ?? null;
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
});
