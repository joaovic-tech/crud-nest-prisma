import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'prisma.service';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await argon2.hash(data.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      const userEntity: UserEntity = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return userEntity;
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserEntity> {
    const { id, email, name } = await this.prisma.user.findUniqueOrThrow({
      where: userWhereUniqueInput,
    });

    const userEntity: UserEntity = {
      id,
      email,
      name,
    };

    return userEntity;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { email, name } = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    const userEntity: UserEntity = {
      id,
      email,
      name,
    };

    return userEntity;
  }

  async remove(id: number) {
    const userDeleted = await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: `Usuário {${userDeleted.name}} deletado com sucesso!`,
    };
  }
}
