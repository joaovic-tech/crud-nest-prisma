import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { BookEntity } from './entities/book.entity';
import { CurrentUser } from 'modules/auth/decorator/current-user.decorator';
import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('book')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<BookEntity> {
    const userId = user.id;
    return this.bookService.create(createBookDto, userId);
  }

  @Get('books')
  findAll() {
    return this.bookService.findAll();
  }

  @Get('book/:id')
  findOne(@Param('id') id: string) {
    return this.bookService.findById(+id);
  }

  @Patch('book/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.bookService.update(+id, updateBookDto, user);
  }

  @Delete('book/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.bookService.remove(+id, user);
  }
}
