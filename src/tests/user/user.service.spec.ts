import { UserService } from 'modules/user/user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'prisma.service';
import { Logger } from '@nestjs/common';
import { UserEntity } from 'modules/user/entities/user.entity';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';

describe('UserService', () => {
  const mockUser: CreateUserDto = {
    email: 'teste@teste.com',
    name: 'tester',
    password: 'tester@s12',
  };
  const mockUserToDB = {
    id: 1,
    ...mockUser,
  };
  let service: UserService;
  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

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
    prismaMock.user.create.mockResolvedValue(mockUserToDB);

    const result = await service.create(mockUserToDB);
    expect(result).toEqual(
      expect.objectContaining({
        name: mockUserToDB.name,
        email: mockUserToDB.email,
      }),
    );
  });

  it('Should hash the password before saving to database', async () => {
    prismaMock.user.create.mockResolvedValue(mockUserToDB);

    await service.create(mockUserToDB);

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: expect.any(String) as string,
        }) as unknown,
      }),
    );
  });

  it('Should list user without password', async () => {
    const usersFromDb = [
      { id: 1, name: 'test', email: 'test@test.com' },
      { id: 2, name: 'tester2', email: 'test2@test2.com' },
    ];

    prismaMock.user.findMany.mockResolvedValue(usersFromDb);
    const users: UserEntity[] = await service.findAll();

    expect(users[0]).not.toHaveProperty('password');
  });

  it('Should find a user by unique input', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(mockUserToDB);

    const result = await service.findOne({ id: mockUserToDB.id });

    expect(result).toEqual({
      id: mockUserToDB.id,
      email: mockUserToDB.email,
      name: mockUserToDB.name,
    });
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: mockUserToDB.id },
    });
  });

  it('Should update user data', async () => {
    prismaMock.user.update.mockResolvedValue(mockUserToDB);

    const result = await service.update(mockUserToDB.id, mockUser);

    expect(result.email).toEqual(mockUserToDB.email);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: mockUserToDB.id },
      data: mockUser,
    });
  });

  it('Should delete user', async () => {
    prismaMock.user.delete.mockResolvedValue(mockUserToDB);

    const createdUser = await service.create(mockUserToDB);

    expect(createdUser).not.toBeNull();

    const result = await service.remove(mockUserToDB.id);
    expect(result).toEqual({
      message: `Usuário {${mockUserToDB.name}} deletado com sucesso!`,
    });
  });
});
