import { AuthError } from 'next-auth';
import { z } from 'zod';

export const errorHandler = (error: unknown) => {
  if (error instanceof z.ZodError) {
    let errorArr: string[] = [];
    error.errors.forEach((err) => {
      const { path, message } = err;
      const fieldName = path.join('.');
      const error = `${fieldName}: ${message}`;

      errorArr = [...errorArr, error];
    });

    const errorRes = `Validation error: ${errorArr.join(', ')}`;

    let errorResponse = {
      status: 400,
      body: writeErrorResponseJson(errorRes),
    };
    return errorResponse;
  }
  if (error instanceof AuthError) {
    if (error instanceof AuthError) {
      switch ((error as any).type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    return error;
  }

  return error;
};

export const writeErrorResponseJson = (message: string) => ({
  errorMessage: message,
});

export const formatDateDMY = (time: number | string): string => {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} bytes`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
