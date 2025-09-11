import type { InferSelectModel } from "drizzle-orm";
import type { builds, buildImages } from "~/server/db/schema";

type Build = InferSelectModel<typeof builds>;
type BuildImage = InferSelectModel<typeof buildImages>;

export type BuildWithImages = Build & {
  images: BuildImage[];
};
