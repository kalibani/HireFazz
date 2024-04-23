import { errorHandler } from '@/helpers';
import { utapi } from '@/lib/upload-thing-server';
import { CV_SOURCE } from '@prisma/client';
import prismadb from '@/lib/prismadb';

export const uploadCv = async (
  {
    cv,
    source,
    orgId,
  }: { cv: File | string; source: CV_SOURCE; orgId: string },
  onSuccess: (props: {
    id: string;
    url: string;
    key: string;
  }) => void | undefined,
) => {
  try {
    const url = typeof cv === 'string' ? cv : '';

    const cvDbData = await prismadb.cv.create({
      data: {
        url: url,
        orgId: orgId,
        source,
        name: '',
        key: '',
        uploadStatus: url ? 'SUCCESS' : 'PENDING',
      },
    });
    if (typeof cv === 'string') {
      if (onSuccess) {
        onSuccess({
          id: cvDbData.id,
          url: url,
          key: '',
        });
      }
      return;
    }
    const fileuploaded = await utapi.uploadFiles([cv]);
    if (fileuploaded[0].data) {
      await prismadb.cv.update({
        where: {
          id: cvDbData.id,
        },
        data: {
          url: fileuploaded[0].data?.url,
          name: fileuploaded[0].data?.name,
          key: fileuploaded[0].data?.key,
          uploadStatus: 'SUCCESS',
        },
      });
      if (onSuccess) {
        onSuccess({
          id: cvDbData.id,
          url: fileuploaded[0].data?.url,
          key: fileuploaded[0].data?.key,
        });
      }
      return fileuploaded[0].data;
    }
    await prismadb.cv.update({
      where: {
        id: cvDbData.id,
      },
      data: {
        uploadStatus: 'FAILED',
      },
    });
    return false;
  } catch (error) {
    return errorHandler(error);
  }
};
