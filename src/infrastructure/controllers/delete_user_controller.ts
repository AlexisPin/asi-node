import type DeleteUserUseCase from '#domain/usecases/delete_user_usecase';

export default class DeleteUserController {
  constructor(private usecase: DeleteUserUseCase) {}

  handle(id: number) {
    return this.usecase.handle(id);
  }
}
