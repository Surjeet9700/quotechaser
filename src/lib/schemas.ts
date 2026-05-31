import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const createQuoteSchema = z.object({
  customerName: z.string().min(1, "Customer name is required."),
  contactName: z.string().min(1, "Contact name is required."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().optional(),
  service: z.string().min(1, "Service is required."),
  amount: z.coerce.number().min(0, "Amount must be positive."),
  quoteSentOn: z.string().min(1, "Sent date is required."),
  notes: z.string().optional(),
});

export const updateQuoteSchema = createQuoteSchema.extend({
  id: z.string().uuid("Invalid quote ID."),
});

export const updateQuoteStatusSchema = z.object({
  id: z.string().uuid("Invalid quote ID."),
  status: z.enum(["open", "won", "lost", "snoozed"], {
    message: "Invalid status",
  }),
});

export const logFollowUpSchema = z.object({
  id: z.string().uuid("Invalid quote ID."),
  channel: z.string().min(1, "Channel is required."),
  currentStage: z.coerce.number(),
  quoteSentOn: z.string().min(1, "Quote sent date is required."),
});

export const deleteQuoteSchema = z.object({
  id: z.string().uuid("Invalid quote ID."),
});

export const updateProfileSchema = z.object({
  senderName: z.string().optional(),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  signature: z.string().optional(),
});

export const updateTemplateSchema = z.object({
  id: z.string().uuid("Invalid template ID."),
  body: z.string().min(1, "Template body cannot be empty."),
});

export const sendQuoteEmailSchema = z.object({
  email: z.string().email("Invalid email address."),
  subject: z.string().min(1, "Subject is required."),
  body: z.string().min(1, "Message body is required."),
  quoteId: z.string().uuid().optional().or(z.literal("")),
});

export const submitFeedbackSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
  sentiment: z.string().optional(),
});
