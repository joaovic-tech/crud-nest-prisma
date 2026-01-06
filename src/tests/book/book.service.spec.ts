import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from 'modules/book/book.service';
import { CreateBookDto } from 'modules/book/dto/create-book.dto';
import { BookEntity } from 'modules/book/entities/book.entity';
import { PrismaService } from 'prisma.service';

describe('BookService', () => {
  let service: BookService;
  const mockBookDTO: CreateBookDto = {
    title: 'Test Book',
    author: 'Test Author',
    date: new Date('2024-01-01'),
    isPublic: true,
    pageNumbers: 100,
  };
  const prismaMock = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create book and return the book entity', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue({ id: 1 });
    prismaMock.book.create.mockResolvedValue(mockBookDTO);

    const result: BookEntity = await service.create(mockBookDTO, 1);

    expect(result).toEqual(mockBookDTO);
    expect(prismaMock.book.create).toHaveBeenCalledWith({
      data: {
        ...mockBookDTO,
        userId: 1,
      },
    });
  });

  it('should find all books and return an array of book entities', async () => {
    const mockBooks = [
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
    ];
    prismaMock.book.findMany.mockResolvedValue(mockBooks);
    const result = await service.findAll();

    expect(result).toEqual(mockBooks);
    expect(prismaMock.book.findMany).toHaveBeenCalled();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Test Book 2',
          author: 'Test Author 2',
          date: new Date('2024-02-02'),
          isPublic: true,
          pageNumbers: 200,
        }),
      ]),
    );
  });
});
