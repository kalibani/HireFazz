'use server';

import { utapi } from '@/lib/upload-thing-server';

// const uploadVideo = async (videoFile: FormData) => {
//   console.log(videoFile, '???? ???');
//   try {
//     const files = videoFile.getAll('file') as File[];
//     if (files) {
//       // const fileuploaded = await utapi.uploadFiles(files);
//       console.log({ videoFile, files }, '<<<< action');
//     }
//   } catch (error) {}
// };
export async function uploadVideo(videoFile: FormData) {
  try {
    const files = videoFile.getAll('file') as File[];
    if (files) {
      const fileuploaded = await utapi.uploadFiles(files);
      console.log(fileuploaded[0].data , '<<<< action');
    }
  } catch (error) {}
}
