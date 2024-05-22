import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { productName } from '@/constant';
import { format, fromUnixTime } from 'date-fns';

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
  selectedProductName: productName,
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
  K extends keyof T,
>(
  obj: T,
  propToDelete: K,
): Omit<T, K> => {
  const { [propToDelete]: deletedProp, ...rest } = obj;
  return rest;
};

export const formatDateStringToDate = (inputDateString: string) => {
  // Convert the input string to a JavaScript Date object
  const date = fromUnixTime(parseInt(inputDateString) / 1000); // Divide by 1000 to convert milliseconds to seconds

  // Format the date using the desired format
  const formattedDate = format(date, 'dd MMM, yyyy'); // Format example: '20 Mar, 2024'

  return formattedDate;
};

export const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

export const audioConstraints = {
  suppressLocalAudioPlayback: true,
  noiseSuppression: true,
  echoCancellation: true,
};
export const blobToFile = (blob: Blob, fileName: string): File => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

// export const blobToFormData = (
//   blob: Blob,
//   filename: string,
// ): Promise<FormData> => {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData();
//     formData.append('file', blob, filename);
//     if (formData.getAll('file').length === 0) {
//       reject('Blob could not be appended to FormData');
//     } else {
//       resolve(formData);
//     }
//   });
// };

export const blobToFormData = async (
  blob: Blob | string,
  filename: string,
): Promise<any> => {
  if (typeof blob !== 'string') {
    const formData = new FormData();
    formData.append('file', blob, filename);

    if (!formData.has('file')) {
      throw new Error('Blob could not be appended to FormData');
    }

    return formData;
  } else {
    return blob;
  }
};

export const separateThousand = (value: string, separator: string = '.') => {
  // remove non digit char
  const removeNonDigit = value.replace(/\D/g, '');
  // remove existing separator, so can correctly return next separator
  const removedSeparator = removeNonDigit.split(separator).join('');

  // add separator
  return removedSeparator.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const removeNonDigit = (value: string) => {
  return value.replace(/\D/g, '');
};

// return truncated string if len is over maxLen
export const truncateString = (str: string, maxLen: number) => {
  const value = str;
  const truncated = value.slice(0, maxLen);

  const isOverflow = value.length > truncated.length;
  console.log('isOV', isOverflow, value, truncateString);

  return isOverflow ? `${truncated}...` : str;
};
