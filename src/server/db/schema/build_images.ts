import {
  pgTableCreator,
  uuid,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { builds } from "./builds";

const createTable = pgTableCreator((name) => `lowpowerheroes_${name}`);

export const buildImages = createTable("build_images", {
  image_id: uuid("image_id").primaryKey().defaultRandom().notNull(),
  build_id: uuid("build_id")
    .notNull()
    .references(() => builds.build_id, { onDelete: "cascade" }),

  image_url: varchar("image_url", { length: 512 }).notNull(),
  is_primary: boolean("is_primary").default(false).notNull(),
  order_index: integer("order_index"), // opzionale: per gestire ordinamento manuale
});

// Relations
export const buildImagesRelations = relations(buildImages, ({ one }) => ({
  build: one(builds, {
    fields: [buildImages.build_id],
    references: [builds.build_id],
  }),
}));
