CREATE TABLE IF NOT EXISTS "lowpowerheroes_builds" (
	"build_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"build_name" varchar(256) NOT NULL,
	"build_description" text NOT NULL,
	"build_mods" varchar(256)[] NOT NULL,
	"driver_description" text NOT NULL,
	"driver_name" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lowpowerheroes_build_images" (
	"image_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"build_id" uuid NOT NULL,
	"image_url" varchar(512) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"order_index" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lowpowerheroes_build_images" ADD CONSTRAINT "lowpowerheroes_build_images_build_id_lowpowerheroes_builds_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."lowpowerheroes_builds"("build_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "lowpowerheroes_builds" USING btree ("build_name");