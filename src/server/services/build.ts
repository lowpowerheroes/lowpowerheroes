import { db } from "~/server/db"; // il tuo client drizzle
import { builds, buildImages } from "~/server/db/schema";

type NewBuildInput = {
  build_name: string;
  build_description: string;
  build_mods: string[];
  driver_description: string;
  driver_nationality: string;
  images: { url: string; isPrimary?: boolean }[];
};

export async function createBuildWithImages(input: NewBuildInput) {
  return await db.transaction(async (tx) => {
    // 1. Inserisci la build
    const [newBuild] = await tx
      .insert(builds)
      .values({
        build_name: input.build_name,
        build_description: input.build_description,
        build_mods: input.build_mods,
        driver_description: input.driver_description,
        driver_nationality: input.driver_nationality,
      })
      .returning();

    if (!newBuild) throw new Error("Build insert failed");

    // 2. Inserisci le immagini collegate
    if (input.images.length > 0) {
      await tx.insert(buildImages).values(
        input.images.map((img, index) => ({
          build_id: newBuild.build_id,
          image_url: img.url,
          is_primary: img.isPrimary ?? index === 0, // se non specificato, la prima diventa primaria
          order_index: index,
        })),
      );
    }

    return newBuild;
  });
}
