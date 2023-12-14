import type UserRepository from '#domain/contracts/repositories/user_repository';

export default class DeleteUserUsecase {
  constructor(private userRepository: UserRepository) {}

  handle(id: number): Promise<{ id: number }> {
    return this.userRepository.delete(id);
  }
}
