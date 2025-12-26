import { Injectable, Logger } from '@nestjs/common';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'prisma.service';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new UserAlreadyExistsException();
        }
      }
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

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });

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
