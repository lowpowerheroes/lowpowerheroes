import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createBuildWithImages } from "~/server/services/build";
import { s3 } from "~/server/services/r2";

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
      for (const image of build.images) {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: image.image_url.split("/").pop(), // Estrai la chiave (nome file) dall'URL
        });
        // Crea un URL che scade tra 1 ora (3600 secondi)
        image.image_url = await getSignedUrl(s3, command, {
          expiresIn: 3600,
        });
      }
    }

    return builds ?? null;
  }),
});
