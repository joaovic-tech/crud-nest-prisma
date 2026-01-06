import { User } from 'generated/prisma';

export type UserEntity = Pick<User, 'id' | 'email' | 'name'>;
