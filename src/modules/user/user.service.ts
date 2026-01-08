import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './interfaces/user-service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  public async create(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await argon2.hash(data.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    return new UserEntity(newUser);
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  public async findById(userId: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return new UserEntity(user);
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });

    return new UserEntity(user);
  }

  public async remove(id: number) {
    const userDeleted = await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: `Usuário {${userDeleted.name}} deletado com sucesso!`,
    };
  }
}
