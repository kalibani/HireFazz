import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/src/app/[locale]/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
