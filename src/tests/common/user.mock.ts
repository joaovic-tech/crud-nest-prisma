import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'modules/user/dto/update-user.dto';
import { UserEntity } from 'modules/user/entities/user.entity';

const VALID_ARGON2_HASH =
  '$argon2d$v=19$m=16,t=2,p=1$TFBMdXRLSk1UV3p6Tnd0YQ$PiYtnIaK3wVmKs+xmkX4Yg';

export const mockUser: CurrentUserDto = {
  id: 1,
  email: 'test@test.com',
};

export const mockUserToCreated: CreateUserDto = {
  email: mockUser.email,
  name: 'tester',
  password: 'password123',
};

export const mockUserToUpdated: UpdateUserDto = {
  name: 'Updated User',
};

export const mockUserToDB: UserEntity = {
  id: 1,
  name: mockUserToCreated.name,
  email: mockUserToCreated.email,
  password: VALID_ARGON2_HASH,
};
