import z from "zod"

export const springUserSchema = z.object({
    id: z.number(),
    login: z.string(),
    pwd: z.string(),
    account: z.number(),
    lastName: z.string(),
    surName: z.string(),
    email: z.string(),
    cardList: z.array(z.number())
})

