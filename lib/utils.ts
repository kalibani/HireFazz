import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { productName } from '@/constant';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function extractExtension(fileUrl: string) {
  const fileExtension = fileUrl.split('.').pop();
  return fileExtension;
}

export function downloadBlobFile(audioUrl: any, filename: string) {
  const link = document.createElement('a');
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
  if (subscriptionType === 'PREMIUM') return (price = 499000);
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

export const checkValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeLanguagePrefix = (path: string) => {
  // Define a regular expression pattern to match "/id" or "/en" at the beginning of the string
  const regex = /^(\/id|\/en)(\/|$)/;

  // Use replace() to remove the language prefix from the path
  const newPath = path.replace(regex, '/');

  return newPath;
};

export const queryString = (queryParams: any) => {
  //Convert params to a query string
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  return queryString;
};

export const removeProperty = <
  T extends Record<string, any>,
  K extends keyof T
>(
  obj: T,
  propToDelete: K
): Omit<T, K> => {
  const { [propToDelete]: deletedProp, ...rest } = obj;
  return rest;
};
