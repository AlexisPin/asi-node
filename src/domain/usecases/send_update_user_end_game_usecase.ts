import type { UserDto } from '#domain/contracts/dto/user_dto';
import type BusRepository from '#domain/contracts/repositories/bus_repository';

export default class SendUpdateUserEndGameUsecase {
  constructor(private busRepository: BusRepository) {}

  handle(payload: UserDto): void {
    const busPayload = {
      action: 'UPDATE',
      user: {
        ...payload,
      },
    };
    this.busRepository.send_user_update(JSON.stringify(busPayload));
  }
}
