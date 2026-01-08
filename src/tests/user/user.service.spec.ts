import { UserService } from 'modules/user/user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'prisma.service';
import { Logger } from '@nestjs/common';
import { mockUserToCreated, mockUserToDB } from 'tests/common/user.mock';

describe('UserService', () => {
  const prismaMock = {
    user: {
      create: jest.fn().mockResolvedValue(mockUserToDB),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn().mockResolvedValue(mockUserToDB),
      findById: jest.fn().mockResolvedValue(mockUserToDB),
      update: jest.fn().mockResolvedValue(mockUserToDB),
      delete: jest.fn().mockResolvedValue(mockUserToDB),
    },
  };
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        Logger,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('Should create a user successfully with correct data', async () => {
    const result = await service.create(mockUserToDB);
    expect(result).toEqual(
      expect.objectContaining({
        name: mockUserToDB.name,
        email: mockUserToDB.email,
      }),
    );
  });

  it('Should hash the password before saving to database', async () => {
    await service.create(mockUserToDB);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: expect.any(String) as string,
        }) as unknown,
      }),
    );
  });

  it('Should list user', async () => {
    const usersFromDb = [
      mockUserToDB,
      { id: 2, name: 'tester2', email: 'test2@test2.com' },
    ];
    prismaMock.user.findMany.mockResolvedValue(usersFromDb);

    await service.findAll();
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('Should find a user by id', async () => {
    const result = await service.findById(mockUserToDB.id);

    expect(result).toEqual(mockUserToDB);
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: mockUserToDB.id },
    });
  });

  it('Should update user data', async () => {
    const result = await service.update(mockUserToDB.id, mockUserToCreated);

    expect(result.email).toEqual(mockUserToDB.email);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: mockUserToDB.id },
      data: mockUserToCreated,
    });
  });

  it('Should delete user', async () => {
    const createdUser = await service.create(mockUserToDB);
    const result = await service.remove(mockUserToDB.id);

    expect(createdUser).not.toBeNull();
    expect(result).toEqual({
      message: `Usuário {${mockUserToDB.name}} deletado com sucesso!`,
    });
  });
});
