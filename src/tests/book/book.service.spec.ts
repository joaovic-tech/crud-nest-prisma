import { ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import { BookService } from 'modules/book/book.service';
import { BookEntity } from 'modules/book/entities/book.entity';
import { PrismaService } from 'prisma.service';
import {
  createBookDto,
  mockBookDB,
  mockBooks,
  mockBookToUpdated,
} from './mock';

describe('BookService', () => {
  let service: BookService;
  const prismaMock = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create book and return the book entity', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue({ id: 1 });
    prismaMock.book.create.mockResolvedValue(createBookDto);

    const result: BookEntity = await service.create(createBookDto, 1);

    expect(result).toEqual(createBookDto);
    expect(prismaMock.book.create).toHaveBeenCalledWith({
      data: {
        ...createBookDto,
        userId: 1,
      },
    });
  });

  it('should find all books and return an array of book entities', async () => {
    prismaMock.book.findMany.mockResolvedValue(mockBooks);
    const result = await service.findAll();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockBooks[0]),
        expect.objectContaining(mockBooks[1]),
      ]),
    );
    expect(prismaMock.book.findMany).toHaveBeenCalledWith({
      where: { isPublic: true },
    });
  });

  it('Should find a book by unique input', async () => {
    prismaMock.book.findUniqueOrThrow.mockResolvedValue(mockBookDB);
    const result = await service.findOne(1);
    const plain = instanceToPlain(result);

    expect(result).toBeInstanceOf(BookEntity);
    expect(plain).not.toHaveProperty('id');
    expect(plain).not.toHaveProperty('userId');
  });

  it('should update book if user is owner', async () => {
    prismaMock.book.findUniqueOrThrow.mockResolvedValue({ id: 1, userId: 1 });
    prismaMock.book.update.mockResolvedValue(mockBookToUpdated);

    const user = { id: 1, email: 'test@test.com' };
    const result = await service.update(1, mockBookToUpdated, user);
    const plain = instanceToPlain(result);

    expect(result).toBeInstanceOf(BookEntity);
    expect(plain).not.toHaveProperty('id');
    expect(plain).not.toHaveProperty('userId');
    expect(prismaMock.book.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: mockBookToUpdated,
    });
  });

  it('should throw error if user is not owner', async () => {
    prismaMock.book.findUniqueOrThrow.mockResolvedValue({ id: 1, userId: 2 });
    const user = { id: 1, email: 'test@test.com' };
    await expect(service.update(1, mockBookToUpdated, user)).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('should delete book if user is owner', async () => {
    prismaMock.book.findUniqueOrThrow.mockResolvedValue({ id: 1, userId: 1 });
    prismaMock.book.delete.mockResolvedValue(mockBookToUpdated);

    const user = { id: 1, email: 'test@test.com' };
    const result = await service.remove(1, user);
    const plain = instanceToPlain(result);

    expect(result).toBeInstanceOf(BookEntity);
    expect(plain).not.toHaveProperty('id');
    expect(plain).not.toHaveProperty('userId');
    expect(prismaMock.book.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw error if user is not owner', async () => {
    prismaMock.book.findUniqueOrThrow.mockResolvedValue({ id: 1, userId: 2 });
    const user = { id: 1, email: 'test@test.com' };
    await expect(service.remove(1, user)).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
