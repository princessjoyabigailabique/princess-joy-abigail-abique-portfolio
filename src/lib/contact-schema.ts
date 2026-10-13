import { z } from "zod";

export const INQUIRY_TYPES = ["Internship opportunity", "Automation / freelance inquiry", "Collaboration", "General question"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters).").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  inquiryType: z.enum(INQUIRY_TYPES, { errorMap: () => ({ message: "Choose an inquiry type." }) }),
  subject: z.string().trim().min(3, "Enter a subject (at least 3 characters).").max(150),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(2000, "Keep the message under 2000 characters."),
  // Optional context for automation inquiries — never required.
  business: z.string().trim().max(150).optional().or(z.literal("")),
  process: z.string().trim().max(500).optional().or(z.literal("")),
  tools: z.string().trim().max(300).optional().or(z.literal("")),
  outcome: z.string().trim().max(500).optional().or(z.literal("")),
  // Honeypot: real users leave this empty.
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;
