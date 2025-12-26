import { Exclude } from 'class-transformer';
import { User } from 'generated/prisma';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string | null;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
