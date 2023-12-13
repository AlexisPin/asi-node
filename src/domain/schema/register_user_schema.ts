import z from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  sender_id: z.number(),
  receiver_id: z.number(),
});