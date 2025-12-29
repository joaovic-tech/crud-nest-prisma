import { UserService } from 'modules/user/user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'prisma.service';
import { Logger } from '@nestjs/common';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';
import { UserEntity } from 'modules/user/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
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

  test('Should create a user successfully with correct data', async () => {
    const userDTO = new CreateUserDto();
    userDTO.email = 'test@test.com';
    userDTO.name = 'tester';
    userDTO.password = 'senha123';

    const userFromDb = { ...userDTO, id: 1 };

    prismaMock.user.create.mockResolvedValue(userFromDb);

    const result = await service.create(userDTO);
    expect(result).toEqual(
      expect.objectContaining({
        name: userDTO.name,
        email: userDTO.email,
      }),
    );
  });

  test('Should hash the password before saving to database', async () => {
    const userDTO = new CreateUserDto();
    userDTO.email = 'test@test.com';
    userDTO.name = 'tester';
    userDTO.password = 'senha123';

    const userFromDb = { ...userDTO, id: 1 };

    prismaMock.user.create.mockResolvedValue(userFromDb);

    await service.create(userDTO);

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: expect.any(String) as string,
        }) as unknown,
      }),
    );
  });

  test('Should list user without password', async () => {
    const usersFromDb = [
      { id: 1, name: 'tester', email: 'test@test.com' },
      { id: 2, name: 'tester2', email: 'test2@test2.com' },
    ];

    prismaMock.user.findMany.mockResolvedValue(usersFromDb);
    const users: UserEntity[] = await service.findAll();

    expect(users[0]).not.toHaveProperty('password');
  });
});
