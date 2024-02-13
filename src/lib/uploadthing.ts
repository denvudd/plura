import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";

import type { FileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<FileRouter>();
export const UploadDropzone = generateUploadDropzone<FileRouter>();
export const Uploader = generateUploader<FileRouter>();

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<FileRouter>();
