import type { registerUserSchema } from '#domain/schema/register_user_schema';
import z from 'zod';

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
