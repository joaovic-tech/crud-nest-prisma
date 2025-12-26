import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @Get('users')
  public async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll({});
    return users.map((user) => new UserEntity(user));
  }

  @Get('user/:id')
  public async findOne(@Param('id') id: number): Promise<UserEntity> {
    const user = await this.userService.findOne({ id: +id });
    return new UserEntity(user);
  }

  @Put('user/:id')
  public async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const userCreated = await this.userService.update(+id, updateUserDto);
    return new UserEntity(userCreated);
  }

  @Delete('user/:id')
  public async remove(@Param('id') id: number): Promise<UserEntity> {
    const userCreated = await this.userService.remove(+id);
    return new UserEntity(userCreated);
  }
}
