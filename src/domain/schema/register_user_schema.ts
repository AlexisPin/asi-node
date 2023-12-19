import z from 'zod';

export const registerUserSchema = z.object({
  id: z.number(),
  login: z.string(),
  pwd: z.string(),
  account: z.number().positive(),
  cardList: z.array(z.number()),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
