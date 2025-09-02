import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  uuid,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `lowpowerheroes_${name}`);

export const builds = createTable(
  "builds",
  {
    build_id: uuid("build_id").primaryKey().defaultRandom().notNull(),
    build_name: varchar("build_name", { length: 256 }).notNull(),
    build_description: text("build_description").notNull(),
    build_mods: varchar("build_mods", { length: 256 }).array().notNull(),
    driver_description: text("driver_description").notNull(),
    driver_nationality: varchar("driver_nationality", {
      length: 256,
    }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date())
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (builds) => ({
    nameIndex: index("name_idx").on(builds.build_name),
  }),
);
