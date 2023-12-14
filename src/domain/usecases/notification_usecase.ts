import type BusRepository from '#domain/contracts/repositories/bus_repository';
import type { MessageDto } from '#domain/dto/message_dto';
import type SendMessageUsecase from './send_message_usecase';

export default class NotificationUsecase {
  constructor(
    private sendMessageUsecase: SendMessageUsecase,
    private busRepository: BusRepository,
  ) {}

  async handle(message: MessageDto) {
    const messageDao = await this.sendMessageUsecase.handle(message);
    await this.busRepository.send_chat_message(JSON.stringify(messageDao));
    return messageDao;
  }
}
