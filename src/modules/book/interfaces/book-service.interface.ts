import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';
import { CreateBookDto } from 'modules/book/dto/create-book.dto';
import { UpdateBookDto } from 'modules/book/dto/update-book.dto';
import { BookEntity } from 'modules/book/entities/book.entity';

export interface IBookService {
  create(bookDTO: CreateBookDto, userId: number): Promise<BookEntity>;
  findAll(): Promise<BookEntity[]>;
  findById(id: number): Promise<BookEntity>;
  update(
    id: number,
    updateBookDto: UpdateBookDto,
    currentUser: CurrentUserDto,
  ): Promise<BookEntity>;
  remove(id: number, currentUser: CurrentUserDto): Promise<BookEntity>;
}
