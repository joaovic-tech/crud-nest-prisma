import { Injectable, Logger } from '@nestjs/common';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'prisma.service';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  async create(data: Prisma.UserCreateInput) {
    const { email, password, books, name } = data;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user !== null) {
        throw new UserAlreadyExistsException();
      }

      const hashedPassword = await argon2.hash(password);

      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          books,
          name,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    try {
      const user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });

      if (!user) {
        throw new UserNotFoundException();
      }

      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
