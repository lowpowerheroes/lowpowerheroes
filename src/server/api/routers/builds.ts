import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds } from "~/server/db/schema";
import {
  createPinterestBoard,
  createPinterestPin,
} from "~/server/utils/pinterest";

export const buildRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        tags: z.string().array(),
        images: z.string().array(),
        mods: z.string().array(),
        driver_nationality: z.string(),
        driver_description: z.string(),
        driver_image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const boardId = await createPinterestBoard({
        name: input.name,
        description: input.description,
        accessToken: `${process.env.PINTEREST_ACCESS_TOKEN}`,
      });

      const imageUrls = await createPinterestPin({
        boardId,
        title: input.name,
        base64Images: input.images,
        accessToken: `${process.env.PINTEREST_ACCESS_TOKEN}`,
      });

      await ctx.db.insert(builds).values({
        build_name: input.name,
        build_description: input.description,
        build_tags: input.tags,
        build_images: imageUrls,
        build_mods: input.mods,
        driver_nationality: input.driver_nationality,
        driver_description: input.driver_description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const build = await ctx.db.query.builds.findFirst({
      orderBy: (builds, { desc }) => [desc(builds.createdAt)],
    });

    return build ?? null;
  }),
});
