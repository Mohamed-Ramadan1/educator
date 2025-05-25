import { Test, TestingModule } from '@nestjs/testing';
import { PasswordManagementController } from './password-management.controller';

describe('PasswordManagementController', () => {
  let controller: PasswordManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordManagementController],
    }).compile();

    controller = module.get<PasswordManagementController>(PasswordManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
