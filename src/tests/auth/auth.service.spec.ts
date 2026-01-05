import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'argon2';
import { AuthService } from 'modules/auth/auth.service';
import { AuthUserEntity } from 'modules/auth/entities/auth-user.entity';
import { IUser } from 'modules/user/interface/user.interface';
import { PrismaService } from 'prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockAuthUserEntity: AuthUserEntity = {
    email: 'test@example.com',
    password: 'password',
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mocked_token'),
  };

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a user with valid credentials', async () => {
    const mockUserToDB: IUser = {
      id: 1,
      name: 'tester',
      email: mockAuthUserEntity.email,
      password: await hash(mockAuthUserEntity.password),
    };
    prismaMock.user.findUnique.mockResolvedValue(mockUserToDB);

    const result = await service.signIn(
      mockAuthUserEntity.email,
      mockAuthUserEntity.password,
    );

    expect(result).toEqual({ accessToken: 'mocked_token' });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockAuthUserEntity.email },
    });
  });

  it('should throw UnauthorizedException for invalid email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.signIn('invalid@example.com', 'invalidPassword'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const mockUserToDB: IUser = {
      id: 1,
      name: 'tester',
      email: mockAuthUserEntity.email,
      password: await hash(mockAuthUserEntity.password),
    };
    prismaMock.user.findUnique.mockResolvedValue(mockUserToDB);
    await expect(
      service.signIn(mockAuthUserEntity.email, 'wrongpassword'),
    ).rejects.toThrow('Invalid credentials');
  });
});
