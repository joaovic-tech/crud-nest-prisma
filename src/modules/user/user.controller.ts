import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UserExceptionFilter } from './filters/prisma-client-exception.filter';
import { UserEntity } from './entities/user.entity';

@Controller()
@UseFilters(new UserExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  public async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @Get('users')
  public async findAll() {
    const users = await this.userService.findAll({});
    return users.map((user) => new UserEntity(user));
  }

  @Get('user/:id')
  public async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne({ id: +id });
    return new UserEntity(user);
  }

  @Delete('user/:id')
  public remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
