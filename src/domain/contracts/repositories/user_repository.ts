import type { RegisterUserDto } from '#domain/dto/register_user_dto';

export interface RegisterUserDao {
  id: number;
  login: string;
  cardList: number[];
  account: number;
}

export default abstract class UserRepository {
  abstract save(user: RegisterUserDto): Promise<{ id: number }>;
  abstract getAll(): Promise<RegisterUserDao[]>;
  abstract delete(id: number): Promise<{ id: number }>;
}
