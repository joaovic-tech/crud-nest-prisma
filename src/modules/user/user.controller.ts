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
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  public async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Post('user')
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.create(createUserDto);
  }

  @Get('user/:id')
  public async findOne(@Param('id') id: number): Promise<UserEntity> {
    return await this.userService.findOne({ id: +id });
  }

  @Put('user/:id')
  public async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete('user/:id')
  public async remove(@Param('id') id: number) {
    return await this.userService.remove(+id);
  }
}
