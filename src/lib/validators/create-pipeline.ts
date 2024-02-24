import { z } from "zod";

export const CreatePipelineValidator = z.object({
  name: z.string().min(1),
});

export type CreatePipelineSchema = z.infer<typeof CreatePipelineValidator>;
