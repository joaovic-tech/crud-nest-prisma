import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'modules/user/user.controller';
import { UserService } from 'modules/user/user.service';
import {
  mockUserToCreated,
  mockUserToDB,
  mockUserToUpdated,
} from 'tests/common/user.mock';

describe('UserController', () => {
  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUserService.create.mockResolvedValue(mockUserToCreated);

      const result = await controller.create(mockUserToCreated);

      expect(result).toEqual(mockUserToCreated);
      expect(mockUserService.create).toHaveBeenCalledWith(mockUserToCreated);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserService.findAll.mockResolvedValue([mockUserToDB]);
      const result = await controller.findAll();

      expect(result).toEqual([mockUserToDB]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a single user by id', async () => {
      mockUserService.findById.mockResolvedValue(mockUserToDB);
      const result = await controller.findOne('1');

      expect(result).toEqual(mockUserToDB);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockUserService.update.mockResolvedValue(mockUserToDB);
      const result = await controller.update('1', mockUserToUpdated);

      expect(result).toEqual(mockUserToDB);
      expect(mockUserService.update).toHaveBeenCalledWith(1, mockUserToUpdated);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue({
        message: 'User deleted successfully',
      });
      const result = await controller.remove('1');

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
