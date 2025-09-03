import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";

const REGION = "auto";
export const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const uploadFileToR2 = async (
  buffer: Buffer,
  filename: string,
  contentType?: string,
) => {
  const key = `${randomUUID()}-${filename}`;
  const type =
    contentType ??
    (await fileTypeFromBuffer(buffer))?.mime ??
    "application/octet-stream";

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: type,
      ACL: "public-read",
    }),
  );

  return `${ENDPOINT}/${BUCKET_NAME}/${key}`;
};
