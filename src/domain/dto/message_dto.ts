import type { sendMessageSchema } from '#domain/schema/register_user_schema';
import z from 'zod';

export type MessageDto = z.infer<typeof sendMessageSchema>;