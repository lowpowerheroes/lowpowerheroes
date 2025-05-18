export async function uploadImageToPinterest({
  accessToken,
  boardId,
  imageUrl,
  title,
  description,
}: {
  accessToken: string;
  boardId: string;
  imageUrl: string;
  title: string;
  description: string;
}) {
  const response = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      board_id: boardId,
      title,
      description,
      media_source: {
        source_type: "image_url",
        url: imageUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Pinterest upload failed");
  }

  const data = await response.json();
  return data.media.images.originals.url as string;
}
