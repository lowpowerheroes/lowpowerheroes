import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string" && reader.result !== null) {
        // ora TS sa che è stringa valida
        const base64 = reader.result.split(",")[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error("Base64 string is empty"));
        }
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
  });
