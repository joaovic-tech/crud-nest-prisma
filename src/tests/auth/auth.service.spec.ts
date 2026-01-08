import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'modules/auth/auth.service';
import { PrismaService } from 'prisma.service';
import { mockAuthUserEntity } from 'tests/common/auth.mock';
import { mockUserToDB } from 'tests/common/user.mock';

describe('AuthService', () => {
  let service: AuthService;
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
    prismaMock.user.findUnique.mockResolvedValue(mockUserToDB);
    await expect(
      service.signIn(mockAuthUserEntity.email, 'wrongpassword'),
    ).rejects.toThrow('Invalid credentials');
  });
});
