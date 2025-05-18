import type { ImgurUploadResponse } from "../types/imgur";

export async function uploadToImgur(
  imageBase64: string,
  clientId: string,
): Promise<string> {
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${clientId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageBase64 }),
  });

  const data = (await response.json()) as ImgurUploadResponse;
  if (!data.success) throw new Error("Upload to Imgur failed");
  return data.data.link;
}
