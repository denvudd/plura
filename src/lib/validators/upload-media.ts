import { z } from "zod";

export const UploadMediaValidator = z.object({
  link: z.string().min(1, { message: "Media file is required" }).url(),
  name: z.string().min(1, { message: "Media name is required" }),
});

export type UploadMediaSchema = z.infer<typeof UploadMediaValidator>;
