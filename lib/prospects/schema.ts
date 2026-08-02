import { z } from "zod";
import { relationshipTypes } from "./constants";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value));

export const createProspectSchema = z.object({
  contactName: z.string().trim().min(1, "Contact name is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  role: optionalText,
  phone: optionalText,
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email")])
    .transform((value) => (value.length === 0 ? null : value)),
  website: optionalText,
  linkedinUrl: optionalText,
  notes: optionalText,
  relationshipType: z.enum(relationshipTypes),
});

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
