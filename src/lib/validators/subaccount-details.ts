import { z } from "zod";

export const SubAccountDetailsValidator = z.object({
  name: z
    .string()
    .min(2, { message: "Subaccount name must be at least 2 characters." }),
  companyEmail: z.string().email({ message: "Invalid email address." }),
  companyPhone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  address: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  city: z.string().min(1, {
    message: "City must be at least 1 character.",
  }),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  subAccountLogo: z.string().url({ message: "Invalid URL." }),
});

export type SubAccountDetailsSchema = z.infer<typeof SubAccountDetailsValidator>;
