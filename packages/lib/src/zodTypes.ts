import z from 'zod';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  phoneNo: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?\d+$/, 'Invalid phone number format'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters long'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters long'),
  phoneNo: z
    .string()
    .regex(/^\d{10,}$/, 'Invalid phone number format or length'),
  email: z.string().trim().email().optional(),
});

const authSchema = z.object({
  type: z.literal('auth'),
  token: z.string(),
  contacts: z.array(z.string().min(10)),
});

const chatSchema = z.object({
  type: z.literal('chat'),
  receiver: z.string().trim().min(10),
  sender: z.string().trim().min(10),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  text: z.string().trim().min(1),
});

const typingSchema = z.object({
  type: z.literal('typing'),
  sender: z.string().trim().min(10),
  receiver: z.string().trim().min(10),
});

const getStatusSchema = z.object({
  type: z.literal('ask-status'),
  statusOf: z.string().trim().min(10),
});

export {
  signInSchema,
  signUpSchema,
  contactSchema,
  chatSchema,
  authSchema,
  typingSchema,
  getStatusSchema,
};
