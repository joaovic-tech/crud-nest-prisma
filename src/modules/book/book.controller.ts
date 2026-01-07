import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { BookEntity } from './entities/book.entity';
import { CurrentUser } from 'modules/auth/decorator/current-user.decorator';
import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';

@Controller('book')
@UseInterceptors(ClassSerializerInterceptor)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<BookEntity> {
    const userId = user.userId;
    return this.bookService.create(createBookDto, userId);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.bookService.update(+id, updateBookDto);
  // }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
