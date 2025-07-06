import z from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(70, 'Email too long');

export const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters long')
  .max(70, 'Password too long');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name is too long');

export const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNo: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const contactSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNo: phoneSchema,
  email: emailSchema.optional(),
});

export const authSchema = z.object({
  type: z.literal('auth'),
  token: z.string(),
  contacts: z.array(z.string().min(10)),
});

export const chatSchema = z.object({
  type: z.literal('chat'),
  receiver: z.string().trim().min(10),
  sender: z.string().trim().min(10),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  text: z.string().trim().min(1),
});

export const typingSchema = z.object({
  type: z.literal('typing'),
  sender: z.string().trim().min(10),
  receiver: z.string().trim().min(10),
});

export const getStatusSchema = z.object({
  type: z.literal('ask-status'),
  statusOf: z.string().trim().min(10),
});
