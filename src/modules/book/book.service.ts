import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { PrismaService } from 'prisma.service';
import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  public create = async (
    bookDTO: CreateBookDto,
    userId: number,
  ): Promise<BookEntity> => {
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
  };

  public findAll = async (): Promise<BookEntity[]> => {
    const books: BookEntity[] = await this.prisma.book.findMany({
      where: {
        isPublic: true,
      },
    });
    return books.map((book) => new BookEntity(book));
  };

  public findOne = async (id: number): Promise<BookEntity> => {
    const book = await this.prisma.book.findUniqueOrThrow({
      where: { id: id, isPublic: true },
    });
    return new BookEntity(book);
  };

  public update = async (
    id: number,
    updateBookDto: UpdateBookDto,
    currentUser: CurrentUserDto,
  ): Promise<BookEntity> => {
    const book = await this.prisma.book.findUniqueOrThrow({
      where: { id },
    });

    if (currentUser.id !== book.userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const updatedBook = await this.prisma.book.update({
      where: { id: id },
      data: updateBookDto,
    });

    return new BookEntity(updatedBook);
  };

  public remove = async (
    id: number,
    currentUser: CurrentUserDto,
  ): Promise<BookEntity> => {
    const book = await this.prisma.book.findUniqueOrThrow({
      where: { id },
    });

    if (currentUser.id !== book.userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const deletedBook = await this.prisma.book.delete({
      where: { id: id },
    });

    return new BookEntity(deletedBook);
  };
}
