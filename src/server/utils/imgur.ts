import type { ImgurUploadResponse } from "../types/imgur";

export const uploadToImgur = async (
  imageBase64: string,
  clientId: string,
): Promise<string> => {
  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: JSON.stringify({
        image: imageBase64,
        type: "base64",
        title: "uploaded_image",
        description: "Uploaded Image",
      }),
    });

    const data = (await response.json()) as ImgurUploadResponse;

    if (!data.success) {
      throw new Error("Imgur upload failed");
    }

    return data.data.link;
  } catch (error) {
    console.error("Error uploading to Imgur:", error);
    throw error;
  }
};
