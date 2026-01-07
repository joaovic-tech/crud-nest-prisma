import { CreateBookDto } from 'modules/book/dto/create-book.dto';

export const mockBookDTO: CreateBookDto = {
  title: 'Test Book',
  author: 'Test Author',
  date: new Date('2024-01-01'),
  isPublic: true,
  pageNumbers: 100,
};

export const mockBooks = [
  {
    title: 'Test Book',
    author: 'Test Author',
    date: new Date('2024-01-01'),
    isPublic: true,
    pageNumbers: 100,
  },
  {
    title: 'Test Book 2',
    author: 'Test Author 2',
    date: new Date('2024-02-02'),
    isPublic: true,
    pageNumbers: 200,
  },
  {
    title: 'Test Book - Private',
    author: 'Test Author 2',
    date: new Date('2024-02-02'),
    isPublic: false,
    pageNumbers: 200,
  },
];

export const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  date: new Date('2024-02-02'),
  isPublic: true,
  pageNumbers: 200,
  userId: 1,
};

export const mockBookToUpdated = {
  id: 1,
  userId: 1,
  title: 'New Title',
};

export const prismaMock = {
  book: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUniqueOrThrow: jest.fn(),
  },
};
