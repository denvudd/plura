import { z } from "zod";

export const LaneDetailsValidator = z.object({
  name: z.string().min(1),
  color: z.string(),
});

export type LaneDetailsSchema = z.infer<typeof LaneDetailsValidator>;
