import pRetry, { AbortError } from "p-retry";
import axios from "axios";
import type {
  PinterestResponseFail,
  PinterestBoardResponseSuccess,
  PinterestPinResponseSuccess,
} from "../types/pinterest";

export async function createPinterestBoard({
  name,
  description,
  accessToken,
}: {
  name: string;
  description: string;
  accessToken: string;
}): Promise<string> {
  return pRetry<string>(
    async () => {
      try {
        const res = await axios.post<PinterestBoardResponseSuccess>(
          "https://api.pinterest.com/v5/boards",
          { name, description, privacy: "PUBLIC" },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        return res.data.id;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const data = error.response?.data as
            | PinterestResponseFail
            | undefined;

          // Controllo se data ha proprietà code:number e message:string
          const isPinterestError =
            data !== undefined &&
            typeof data.code === "number" &&
            typeof data.message === "string";

          if (status === 400 && isPinterestError) {
            throw new AbortError(`Pinterest API error: ${data.message}`);
          }
        }

        throw error;
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      factor: 2,
    },
  );
}

function isPinterestPinResponseSuccess(
  data: unknown,
): data is PinterestPinResponseSuccess {
  if (typeof data !== "object" || data === null) return false;

  // Usa type assertion temporanea per evitare errori
  const d = data as Record<string, unknown>;

  if (!("media" in d)) return false;

  const media = d.media as Record<string, unknown> | undefined;
  if (!media) return false;

  if (!("images" in media)) return false;

  const images = media.images;
  if (!Array.isArray(images)) return false;

  // opzionale: controlla che ogni immagine abbia url stringa
  return images.every(
    (img) =>
      typeof img === "object" &&
      img !== null &&
      "url" in img &&
      typeof (img as Record<string, unknown>).url === "string",
  );
}

/**
 * Crea un Pin con più immagini in base64.
 * Restituisce un array di URL delle immagini caricate su Pinterest.
 */
export async function createPinterestPin({
  boardId,
  title,
  base64Images,
  accessToken,
}: {
  boardId: string;
  title: string;
  base64Images: string[];
  accessToken: string;
}): Promise<string[]> {
  return pRetry<string[]>(
    async () => {
      try {
        const res = await axios.post<PinterestPinResponseSuccess>(
          "https://api.pinterest.com/v5/pins",
          {
            board_id: boardId,
            title,
            media_source: {
              source_type: "multiple_image_base64",
              items: base64Images.map((img) => ({
                content_type: "image/jpeg",
                data: img,
              })),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            validateStatus: () => true, // per gestire status custom dopo
          },
        );

        // Se la risposta è 200 o 201 => OK, ritorna urls
        if (
          res.status === 200 ||
          (res.status === 201 && isPinterestPinResponseSuccess(res.data))
        ) {
          return res.data.media.images.map((img) => img.url);
        }

        // Per errori (400, 401, 403, 404, 429, default) gestiamo di seguito

        const dataFail = res.data as unknown as PinterestResponseFail;

        // Se status è 400 (bad request), abort retry perché è errore client
        if (res.status === 400) {
          throw new AbortError(`Invalid pin data: ${dataFail.message}`);
        }

        // Se status è 401 o 403 (auth o permessi) abortiamo anche qui
        if (res.status === 401 || res.status === 403) {
          throw new AbortError(`Auth error: ${dataFail.message}`);
        }

        // Se status è 404 (risorsa non trovata) abort
        if (res.status === 404) {
          throw new AbortError(`Resource not found: ${dataFail.message}`);
        }

        // Se status è 429 (rate limit), possiamo scegliere di ritentare o abortare
        // Qui scelgo di ritentare, ma potresti anche implementare backoff più lungo
        if (res.status === 429) {
          throw new Error(`Rate limited: ${dataFail.message}`);
        }

        // Per altri status (default), facciamo retry per sicurezza
        throw new Error(`Unexpected error ${res.status}: ${dataFail.message}`);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Se è errore Axios non HTTP, rilancia per retry
          throw error;
        }
        // Rilancia qualunque altro errore (inclusi AbortError)
        throw error;
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      factor: 2,
    },
  );
}
