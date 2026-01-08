import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from 'modules/book/book.controller';
import { BookService } from 'modules/book/book.service';
import {
  mockBookEntity,
  mockBookToCreated,
  mockBookToUpdated,
} from '../common/book.mock';
import { CurrentUserDto } from 'modules/auth/dto/current-user.dto';
import { mockUser } from 'tests/common/user.mock';

describe('BookController', () => {
  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  let service: BookService;
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    mockBookService.create.mockResolvedValue(mockBookToCreated);
    const user: CurrentUserDto = { id: 1, email: '...' };
    const result = await controller.create(mockBookToCreated, user);

    expect(result).toEqual(mockBookEntity);
    expect(mockBookService.create).toHaveBeenCalledWith(
      mockBookToCreated,
      user.id,
    );
  });

  it('should find all books', async () => {
    mockBookService.findAll.mockResolvedValue([mockBookEntity]);
    const result = await controller.findAll();

    expect(result).toEqual([mockBookEntity]);
    expect(mockBookService.findAll).toHaveBeenCalled();
  });

  it('should find one book', async () => {
    mockBookService.findById.mockResolvedValue(mockBookEntity);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockBookEntity);
    expect(mockBookService.findById).toHaveBeenCalledWith(1);
  });

  it('should update a book', async () => {
    mockBookService.update.mockResolvedValue(mockBookEntity);
    const result = await controller.update('1', mockBookToUpdated, mockUser);

    expect(result).toEqual(mockBookEntity);
    expect(mockBookService.update).toHaveBeenCalledWith(
      1,
      mockBookToUpdated,
      mockUser,
    );
  });

  it('should remove a book', async () => {
    mockBookService.remove.mockResolvedValue(mockBookEntity);
    const result = await controller.remove('1', mockUser);

    expect(result).toEqual(mockBookEntity);
    expect(mockBookService.remove).toHaveBeenCalledWith(1, mockUser);
  });
});
