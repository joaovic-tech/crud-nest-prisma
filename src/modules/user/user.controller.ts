import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UserModel } from 'generated/prisma/models';
import { UserExceptionFilter } from './filters/prisma-client-exception.filter';

@Controller()
@UseFilters(new UserExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('users')
  async findAll(): Promise<UserModel[]> {
    return this.userService.findAll({});
  }

  @Get('user/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  // @Patch('user/:id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete('user/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
