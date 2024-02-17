import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { productName } from "@/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function extractExtension(fileUrl: string) {
  const fileExtension = fileUrl.split(".").pop();
  return fileExtension;
}

export function downloadBlobFile(audioUrl: any, filename: string) {
  const link = document.createElement("a");
  link.href = audioUrl;
  link.download = `${filename}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function priceSchemeHelper(
  characterCount: number,
  subscriptionType: string,
  selectedProductName: productName
) {
  let price = 19000;
  if (subscriptionType === "PREMIUM") return (price = 499000);
  if (selectedProductName === productName.documentInteraction) return price;
  if (selectedProductName === productName.speechSynthesis) {
    if (characterCount > 2500) return price * 2;
    return price;
  }
}

export const pricing = {
  FREE: 249000, // default price
  BASIC: 249000,
  PRO: 499000,
  PREMIUM: 999000,
};
