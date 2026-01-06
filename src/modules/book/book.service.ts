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

    const bookEntity: BookEntity = {
      ...newBook,
    };
    return bookEntity;
  }

  async findAll(): Promise<BookEntity[]> {
    const books = await this.prisma.book.findMany();
    const bookEntities: BookEntity[] = books.map((book) => ({
      title: book.title,
      author: book.author,
      date: book.date,
      pageNumbers: book.pageNumbers,
      isPublic: book.isPublic,
      userId: book.userId,
    }));
    return bookEntities;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  // update(id: number, updateBookDto: UpdateBookDto) {
  //   return `This action updates a #${id} book`;
  // }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
