'use server';

import { errorHandler } from '@/helpers';
import { utapi } from '@/lib/upload-thing-server';

export async function uploadVideo(videoFile: FormData) {
  try {
    const files = videoFile.getAll('file') as File[];
    if (files) {
      const fileuploaded = await utapi.uploadFiles(files);
      return fileuploaded[0].data?.url;
    }
  } catch (error) {
    return errorHandler(error);
  }
}
