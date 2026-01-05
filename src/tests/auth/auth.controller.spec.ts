import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthService } from 'modules/auth/auth.service';
import { AuthUserEntity } from 'modules/auth/entities/auth-user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signIn: jest.fn().mockResolvedValue({ accessToken: 'mocked_token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generated bearer token', async () => {
    const authUserEntity: AuthUserEntity = {
      email: 'test@example.com',
      password: 'password',
    };
    const result = await controller.signIn(authUserEntity);

    expect(result).toEqual({ accessToken: 'mocked_token' });
  });
});
