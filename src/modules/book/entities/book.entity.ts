import { Exclude } from 'class-transformer';
import { Book } from 'generated/prisma';

export class BookEntity implements Book {
  @Exclude()
  id: number;
  title: string;
  author: string;
  date: Date;
  pageNumbers: number;
  isPublic: boolean;
  @Exclude()
  userId: number | null;

  constructor(partial: Partial<BookEntity>) {
    Object.assign(this, partial);
  }
}
