import z from 'zod';

export const cardSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  family: z.string(),
  affinity: z.string(),
  imgUrl: z.string().url(),
  smallImgUrl: z.string().url(),
  energy: z.number(),
  hp: z.number().positive(),
  defence: z.number().positive(),
  attack: z.number().positive(),
  price: z.number().positive(),
  userId: z.number(),
});

export type Card = z.infer<typeof cardSchema>;
