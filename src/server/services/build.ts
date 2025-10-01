import { db } from "~/server/db";
import { builds } from "~/server/db/schema";
import { buildImages } from "~/server/db/schema/build_images";
import { uploadFileToR2 } from "~/server/services/r2";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME } from "~/server/services/r2";

type ImageInput = {
  id?: string;
  base64?: string;
  isPrimary?: boolean;
};

type CreateBuildInput = {
  build_name: string;
  build_description: string;
  build_mods: string[];
  driver_description: string;
  driver_name: string;
  build_images: ImageInput[];
  driver_nationality: string;
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
          driver_name: input.driver_name,
          driver_nationality: input.driver_nationality,
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

      await uploadImages(tx, build.build_id, input.build_images, uploadedKeys);

      return build;
    } catch (err) {
      // Rollback R2 uploads if something fails
      for (const uploadedKey of uploadedKeys) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uploadedKey,
          }),
        );
      }
      throw err;
    }
  });
}

export async function uploadImages(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  buildId: string,
  images: ImageInput[],
  uploadedKeys: string[] = [], // Optional: for rollback tracking
) {
  for (const [i, img] of images.entries()) {
    if (!img.base64) continue;

    const buffer = Buffer.from(
      img.base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );

    if (buffer.length > 10 * 1024 * 1024) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Image ${i + 1} exceeds the 10MB limit.`,
      });
    }

    // Using a more unique filename to avoid collisions on updates
    const fileName = `${buildId}-${Date.now()}-${i}.jpg`;
    const key = fileName.split("/").pop(); // The key is just the filename

    const url = await uploadFileToR2(buffer, fileName);
    if (key) {
      uploadedKeys.push(key);
    }

    await tx.insert(buildImages).values({
      build_id: buildId,
      image_url: url,
      is_primary: img.isPrimary ?? false,
      order_index: i,
    });
  }
}
