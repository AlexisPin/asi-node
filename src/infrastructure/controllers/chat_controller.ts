import type { Request } from 'express';

import { sendMessageSchema } from '#domain/schema/message_schema';
import type SendChatMessageUsecase from '#domain/usecases/send_chat_message_usecase';

export default class SendChatMessageController {
  constructor(private sendChatMessageUsecase: SendChatMessageUsecase) {}

  handle(req: Request) {
    const body = sendMessageSchema.parse(req.body);
    return this.sendChatMessageUsecase.handle(body);
  }
}
