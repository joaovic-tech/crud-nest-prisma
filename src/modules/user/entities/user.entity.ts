import { Exclude } from 'class-transformer';
import { User } from 'generated/prisma';

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
