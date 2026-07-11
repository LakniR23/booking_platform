import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

const mockServicesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ServicesController', () => {
  let controller: ServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [{ provide: ServicesService, useValue: mockServicesService }],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    jest.clearAllMocks();
  });

  it('should create a service', async () => {
    const dto = { title: 'Haircut', description: '', duration: 30, price: 20, isActive: true };
    mockServicesService.create.mockResolvedValue({ id: '1', ...dto });
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
  });

  it('should return all services', async () => {
    mockServicesService.findAll.mockResolvedValue([{ id: '1' }]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });

  it('should return a single service', async () => {
    mockServicesService.findOne.mockResolvedValue({ id: '1', title: 'Haircut' });
    const result = await controller.findOne('1');
    expect(result.title).toBe('Haircut');
  });

  it('should update a service', async () => {
    mockServicesService.update.mockResolvedValue({ id: '1', title: 'New' });
    const result = await controller.update('1', { title: 'New' });
    expect(result.title).toBe('New');
  });

  it('should delete a service', async () => {
    mockServicesService.remove.mockResolvedValue({ id: '1' });
    const result = await controller.remove('1');
    expect(result).toHaveProperty('id');
  });
});
