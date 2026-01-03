import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../modules/user/user.controller';
import { UserService } from '../../modules/user/user.service';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/user/dto/update-user.dto';
import { UserEntity } from '../../modules/user/entities/user.entity';

describe('UserController', () => {
  const mockUserEntity: UserEntity = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };
  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUserEntity),
    findAll: jest.fn().mockResolvedValue([mockUserEntity]),
    findOne: jest.fn().mockResolvedValue(mockUserEntity),
    update: jest.fn().mockResolvedValue(mockUserEntity),
    remove: jest
      .fn()
      .mockResolvedValue({ message: 'User deleted successfully' }),
  };
  let service: UserService;
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUserEntity);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockUserEntity]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result = await controller.findOne(1);

      expect(result).toEqual(mockUserEntity);
      expect(mockUserService.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(mockUserEntity);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
