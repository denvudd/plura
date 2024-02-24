import { z } from "zod";

export const CreateFunnelValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  subDomainName: z.string().optional(),
  favIcon: z.string().optional(),
});

export type CreateFunnelSchema = z.infer<typeof CreateFunnelValidator>;
