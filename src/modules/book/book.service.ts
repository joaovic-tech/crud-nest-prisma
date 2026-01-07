import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { PrismaService } from 'prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(bookDTO: CreateBookDto, userId: number): Promise<BookEntity> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const newBook = await this.prisma.book.create({
      data: {
        ...bookDTO,
        date: new Date(bookDTO.date),
        userId: user.id,
      },
    });
    return new BookEntity(newBook);
  }

  async findAll(): Promise<BookEntity[]> {
    const books: BookEntity[] = await this.prisma.book.findMany({
      where: {
        isPublic: true,
      },
    });
    return books.map((book) => new BookEntity(book));
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.prisma.book.findUniqueOrThrow({
      where: { id: id, isPublic: true },
    });
    return new BookEntity(book);
  }

  // update(id: number, updateBookDto: UpdateBookDto) {
  //   return {
  //     id: id,
  //     data: updateBookDto,
  //   };
  // }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
