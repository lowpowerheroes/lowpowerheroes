import { db } from "~/server/db";
import { builds } from "~/server/db/schema/builds";
import { buildImages } from "~/server/db/schema/build_images";
import { uploadFileToR2 } from "~/server/services/r2";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME } from "~/server/services/r2";

type CreateBuildInput = {
  build_name: string;
  build_description: string;
  build_mods: string[];
  driver_description: string;
  images: { base64: string; isPrimary?: boolean }[];
};

export async function createBuildWithImages(input: CreateBuildInput) {
  const uploadedKeys: string[] = [];

  return await db.transaction(async (tx) => {
    try {
      const [build] = await tx
        .insert(builds)
        .values({
          build_name: input.build_name,
          build_description: input.build_description,
          build_mods: input.build_mods,
          driver_description: input.driver_description,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!build) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Build creation failed",
        });
      }

      for (const [i, img] of input.images.entries()) {
        const buffer = Buffer.from(
          img.base64.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        );

        if (buffer.length > 10 * 1024 * 1024) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Image ${i + 1} exceeds the 10MB limit`,
          });
        }

        const fileName = `${build.build_id}-${i}.jpg`;
        const key = `${fileName}`;

        try {
          const url = await uploadFileToR2(buffer, fileName);
          uploadedKeys.push(key);

          await tx.insert(buildImages).values({
            build_id: build.build_id,
            image_url: url,
            is_primary: img.isPrimary ?? i === 0,
            order_index: i,
          });
        } catch (err) {
          for (const uploadedKey of uploadedKeys) {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: uploadedKey,
              }),
            );
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Image upload failed, rollback executed",
          });
        }
      }

      return build;
    } catch (err) {
      throw err;
    }
  });
}
