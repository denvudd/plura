import { Role } from "@prisma/client";
import { z } from "zod";

export const UserDataValidator = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url(),
  role: z.nativeEnum(Role),
});

export type UserDataSchema = z.infer<typeof UserDataValidator>;
