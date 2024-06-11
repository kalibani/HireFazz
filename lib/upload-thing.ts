import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/cores";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
