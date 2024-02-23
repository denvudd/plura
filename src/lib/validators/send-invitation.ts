import { Role } from "@prisma/client";
import { z } from "zod";

export const SendInvitationValidator = z.object({
  email: z.string().email(),
  role: z.enum([
    Role.AGENCY_ADMIN,
    Role.SUBACCOUNT_USER,
    Role.SUBACCOUNT_GUEST,
  ]),
});

export type SendInvitationSchema = z.infer<typeof SendInvitationValidator>;
