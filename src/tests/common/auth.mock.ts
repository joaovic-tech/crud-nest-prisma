import { AuthUserEntity } from 'modules/auth/entities/auth-user.entity';
import { mockUserToCreated, mockUserToDB } from './user.mock';

export const mockAuthUserEntity: AuthUserEntity = {
  id: mockUserToDB.id,
  email: mockUserToDB.email,
  password: mockUserToCreated.password, // texto plano 'password123'
};
