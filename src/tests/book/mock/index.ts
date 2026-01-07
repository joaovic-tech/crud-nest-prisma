import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';
import { CreateBookDto } from 'modules/book/dto/create-book.dto';
import { UpdateBookDto } from 'modules/book/dto/update-book.dto';
import { BookEntity } from 'modules/book/entities/book.entity';

export const createBookDto: CreateBookDto = {
  title: 'Test Book',
  author: 'Test Author',
  date: new Date('2024-01-01'),
  isPublic: true,
  pageNumbers: 100,
};

export const mockBookEntity = new BookEntity(createBookDto);

export const mockBookDB = {
  id: 1,
  userId: 1,
  ...createBookDto,
};

export const mockBookToUpdated: UpdateBookDto = new UpdateBookDto(
  createBookDto,
);

export const mockBooks = [
  {
    ...createBookDto,
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

export const mockUser: CurrentUserDto = {
  id: 1,
  email: 'test@test.com',
};
