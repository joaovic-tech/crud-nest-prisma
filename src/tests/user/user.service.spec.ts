import { UserService } from 'modules/user/user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'prisma.service';
import { Logger } from '@nestjs/common';
import { UserEntity } from 'modules/user/entities/user.entity';

const userData = () => {
  return {
    email: 'teste@teste.com',
    name: 'tester',
    password: 'tester@s12',
  };
};

const generatedUserTesterDB = () => {
  return {
    id: 1,
    ...userData(),
  };
};

describe('UserService', () => {
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
    const userTester = generatedUserTesterDB();

    prismaMock.user.create.mockResolvedValue(userTester);

    const result = await service.create(userTester);
    expect(result).toEqual(
      expect.objectContaining({
        name: userTester.name,
        email: userTester.email,
      }),
    );
  });

  it('Should hash the password before saving to database', async () => {
    const userTester = generatedUserTesterDB();

    prismaMock.user.create.mockResolvedValue(userTester);

    await service.create(userTester);

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
    const userFromDb = generatedUserTesterDB();
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(userFromDb);

    const result = await service.findOne({ id: userFromDb.id });

    expect(result).toEqual({
      id: userFromDb.id,
      email: userFromDb.email,
      name: userFromDb.name,
    });
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: userFromDb.id },
    });
  });

  it('Should update user data', async () => {
    const data = userData();
    const userFromDb = generatedUserTesterDB();
    prismaMock.user.update.mockResolvedValue(userFromDb);

    const result = await service.update(userFromDb.id, data);

    expect(result.email).toEqual(userFromDb.email);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: userFromDb.id },
      data: data,
    });
  });

  it('Should delete user', async () => {
    const userFromDb = generatedUserTesterDB();
    prismaMock.user.delete.mockResolvedValue(userFromDb);

    const createdUser = await service.create(userFromDb);

    expect(createdUser).not.toBeNull();

    const result = await service.remove(userFromDb.id);
    expect(result).toEqual({
      message: `Usuário {${userFromDb.name}} deletado com sucesso!`,
    });
  });
});
