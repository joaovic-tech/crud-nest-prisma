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
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
  @UseGuards(JwtAuthGuard)
  public async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findById(+id);
  }

  @Put('user/:id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete('user/:id')
  @UseGuards(JwtAuthGuard)
  public async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
