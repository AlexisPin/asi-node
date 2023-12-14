import z from 'zod';

import type { sendMessageSchema } from '#domain/schema/message_schema';

export type MessageDto = z.infer<typeof sendMessageSchema>;
