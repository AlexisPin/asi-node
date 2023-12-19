import z from 'zod';

export const registerPlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  cardList: z.array(z.number()),
});
