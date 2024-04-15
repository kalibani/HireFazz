import { errorHandler } from '@/helpers';
import { utapi } from '@/lib/upload-thing-server';
import { CV_SOURCE } from '@prisma/client';
import prismadb from '@/lib/prismadb';

export const uploadCv = async (
 {id, cv, source, orgId}: {id: string, cv: File, source: CV_SOURCE, orgId: string},
 onSuccess: (props: {id: string, url: string, key: string}) => void | undefined
) => {
  try {
    await prismadb.cv.create({
      data: {
        id,
        url: '',
        orgId: orgId,
        source,
        name: '',
        key: ''
      }
    })
    const fileuploaded = await utapi.uploadFiles([cv])
    if(fileuploaded[0].data){
      await prismadb.cv.update({
        where: {
          id
        },
        data: {
          url: fileuploaded[0].data?.url,
          name: fileuploaded[0].data?.name,
          key: fileuploaded[0].data?.key,
          uploadStatus: "SUCCESS"
        }
      })
      if(onSuccess){
        onSuccess({id, url: fileuploaded[0].data?.url, key: fileuploaded[0].data?.key})
      }
      return fileuploaded[0].data
    }
    await prismadb.cv.update({
      where: {
        id
      },
      data: {
        uploadStatus: "FAILED"
      }
    })
    return false

  } catch (error) {
    return errorHandler(error);
  }
};
