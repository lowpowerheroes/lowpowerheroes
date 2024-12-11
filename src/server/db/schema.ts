// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `lowpowerheroes_${name}`);

export const builds = createTable(
  "builds",
  {
    build_id: serial("build_id").primaryKey().notNull(),
    build_name: varchar("build_name", { length: 256 }).notNull(),
    build_tags: varchar("build_tags", { length: 256 }).array(),
    build_mods: varchar("build_mods", { length: 256 }).array().notNull(),
    build_description: varchar("build_description", { length: 256 }).notNull(),
    build_images: varchar("build_images", { length: 256 }).array().notNull(),
    driver_descritpion: varchar("driver_descritpion", { length: 256 }),
    driver_nationality: varchar("driver_nationality", {
      length: 256,
    }).notNull(),
    driver_image: varchar("driver_image", { length: 256 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.build_name),
  }),
);
