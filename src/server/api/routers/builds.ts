import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds } from "~/server/db/schema";
// import { uploadToImgur } from "~/server/utils/imgur";
// import { uploadImageToPinterest } from "~/server/utils/pinterest";

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
        driver_descritpion: z.string(),
        driver_image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const imgurClientId = process.env.IMGUR_CLIENT_ID!;
      // const pinterestAccessToken = process.env.PINTEREST_ACCESS_TOKEN!;
      // const pinterestBoardId = process.env.PINTEREST_BOARD_ID!;

      // const pinterestImageLinks: string[] = [];

      // for (const imageBase64 of input.images) {
      //   // 1. Upload su Imgur
      //   const imgurUrl = await uploadToImgur(imageBase64, imgurClientId);

      //   // 2. Crea Pin su Pinterest
      //   const pinterestUrl = await uploadImageToPinterest({
      //     accessToken: pinterestAccessToken,
      //     boardId: pinterestBoardId,
      //     imageUrl: imgurUrl,
      //     title: input.name,
      //     description: input.description,
      //   });

      //   pinterestImageLinks.push(pinterestUrl);
      // }

      await ctx.db.insert(builds).values({
        build_name: input.name,
        driver_description: input.description,
        build_tags: input.tags,
        build_images: input.images,
        build_mods: input.mods,
        driver_nationality: input.driver_nationality,
        driver_descritpion: input.driver_descritpion,
        driver_image: input.driver_image,
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
