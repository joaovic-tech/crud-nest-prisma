import { Book } from 'generated/prisma';

export type BookEntity = Pick<
  Book,
  'title' | 'author' | 'date' | 'pageNumbers' | 'isPublic' | 'userId'
>;
