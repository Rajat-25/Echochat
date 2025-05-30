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
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters long'),
  phoneNo: z
    .string()
    .regex(/^\d{10,}$/, 'Invalid phone number format or length'),
  email: z.string().trim().email().optional(),
});



export { signInSchema, signUpSchema, contactSchema };

