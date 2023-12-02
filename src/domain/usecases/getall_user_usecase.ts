import type UserRepository from '#domain/contracts/repositories/user_repository';

export default class GetallUserUsecase {
  constructor(private userRepository: UserRepository) {}

  handle() {
    return this.userRepository.getAll();
  }
}
