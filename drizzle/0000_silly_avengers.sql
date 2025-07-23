CREATE TABLE IF NOT EXISTS "lowpowerheroes_builds" (
	"build_id" serial PRIMARY KEY NOT NULL,
	"build_name" varchar(256) NOT NULL,
	"build_description" text NOT NULL,
	"build_tags" varchar(256)[],
	"build_mods" varchar(256)[] NOT NULL,
	"driver_description" text NOT NULL,
	"build_images" varchar(256)[] NOT NULL,
	"driver_descritpion" text,
	"driver_nationality" varchar(256) NOT NULL,
	"driver_image" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "lowpowerheroes_builds" USING btree ("build_name");