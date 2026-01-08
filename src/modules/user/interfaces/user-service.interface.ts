import { CreateUserDto } from 'modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'modules/user/dto/update-user.dto';
import { UserEntity } from 'modules/user/entities/user.entity';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(userId: number): Promise<UserEntity>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
  remove(id: number): Promise<{ message: string }>;
}
