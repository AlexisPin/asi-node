
import type { MessageDto } from '#domain/contracts/dto/message_dto';
import type SendChatMessageUsecase from '#domain/usecases/send_chat_message_usecase';

export default class SendChatMessageController {
  constructor(private sendChatMessageUsecase: SendChatMessageUsecase) { }

  handle(message: MessageDto) {
    return this.sendChatMessageUsecase.handle(message);
  }
}
