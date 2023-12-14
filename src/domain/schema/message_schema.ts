import z from 'zod';

export const sendMessageSchema = z
  .object({
    content: z.string().min(1),
    sender_id: z.number(),
    receiver_id: z.number(),
  })
  .refine((data) => data.sender_id !== data.receiver_id, {
    message: 'The sender and receiver must be different',
  });
