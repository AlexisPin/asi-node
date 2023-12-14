import type { sendMessageSchema } from '#domain/schema/message_schema';
import z from 'zod';

export type MessageDto = z.infer<typeof sendMessageSchema>;
