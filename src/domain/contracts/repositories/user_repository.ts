export interface CreateUserDto {
  id: number;
  login: string;
  cardList: number[];
  account: number;
  password: string;
}

export interface RegisterUserDao {
  id: number;
  login: string;
  cardList: number[];
  account: number;
}

export default abstract class UserRepository {
  abstract save(user: CreateUserDto): Promise<{ id: number }>;
  abstract getAll(): Promise<RegisterUserDao[]>;
  abstract delete(id: number): Promise<{ id: number }>;
}
