export interface RegisterUserDto {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserDao {
  id: string;
  username: string;
  email: string;
}

export default abstract class UserRepository {
  abstract save(user: RegisterUserDto): Promise<{ id: string }>;
  abstract getAll(): Promise<RegisterUserDao[]>;
}
