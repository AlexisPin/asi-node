import type GetallUserUsecase from '#domain/usecases/getall_user_usecase';

export default class GetAllUserController {
  constructor(private usecase: GetallUserUsecase) {}

  handle() {
    return this.usecase.handle();
  }
}
