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

export function downloadBlobFile(file: Blob, filename: string) {
  var a = document.createElement("a");
  document.body.appendChild(a);

  var url = window.URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
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
