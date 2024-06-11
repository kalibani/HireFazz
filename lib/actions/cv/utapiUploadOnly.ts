'use server'
import { utapi } from "@/lib/upload-thing-server";

export const utapiUpload = async (cv: File[]) => {
    try {
        const fileuploaded = await utapi.uploadFiles(cv);
        const result: string[] = []
        fileuploaded.forEach((file) => {
            if (file.data?.url) {
                result.push(file.data.url)
            }
        })
        return result
    } catch (error) {
        return;
    }
}