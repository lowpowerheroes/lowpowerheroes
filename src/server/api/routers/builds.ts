import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createBuildWithImages } from "~/server/services/build";

export const buildRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        mods: z.array(z.string()),
        driver_nationality: z.string(),
        driver_description: z.string(),
        images: z.array(
          z.object({
            url: z.string().url(),
            isPrimary: z.boolean().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const build = await createBuildWithImages({
        build_name: input.name,
        build_description: input.description,
        build_mods: input.mods,
        driver_nationality: input.driver_nationality,
        driver_description: input.driver_description,
        images: input.images,
      });

      return build;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const build = await ctx.db.query.builds.findFirst({
      orderBy: (builds, { desc }) => [desc(builds.createdAt)],
    });

    return build ?? null;
  }),
});
