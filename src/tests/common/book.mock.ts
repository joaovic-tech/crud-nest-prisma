import { CreateBookDto } from 'modules/book/dto/create-book.dto';
import { UpdateBookDto } from 'modules/book/dto/update-book.dto';
import { BookEntity } from 'modules/book/entities/book.entity';

const mockBookDTO = {
  title: 'Test Book',
  author: 'Test Author',
  date: new Date('2024-01-01'),
  isPublic: true,
  pageNumbers: 100,
};

export const mockBookToCreated = new CreateBookDto(mockBookDTO);
export const mockBookToUpdated = new UpdateBookDto(mockBookDTO);
export const mockBookEntity = new BookEntity(mockBookDTO);
export const mockBookDB = {
  id: 1,
  userId: 1,
  ...mockBookDTO,
};

export const mockBooks = [
  {
    ...mockBookDTO,
  },
  {
    title: 'Test Book - Private',
    author: 'Test Author 2',
    date: new Date('2024-02-02'),
    isPublic: false,
    pageNumbers: 200,
  },
];
