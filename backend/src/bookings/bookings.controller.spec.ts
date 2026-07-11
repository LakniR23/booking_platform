import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

const mockBookingsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateStatus: jest.fn(),
  cancel: jest.fn(),
};

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockBookingsService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    jest.clearAllMocks();
  });

  it('should create a booking', async () => {
    const dto = {
      customerName: 'John', customerEmail: 'j@test.com', customerPhone: '123',
      serviceId: 's-1', bookingDate: '2030-01-01', bookingTime: '10:00', notes: '',
    };
    mockBookingsService.create.mockResolvedValue({ id: 'b-1', ...dto });
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id', 'b-1');
  });

  it('should return all bookings', async () => {
    mockBookingsService.findAll.mockResolvedValue({ data: [{ id: 'b-1' }], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
    const result = await controller.findAll({});
    expect(result.data).toHaveLength(1);
  });

  it('should return a single booking', async () => {
    mockBookingsService.findOne.mockResolvedValue({ id: 'b-1' });
    const result = await controller.findOne('b-1');
    expect(result).toHaveProperty('id', 'b-1');
  });

  it('should update booking status', async () => {
    mockBookingsService.updateStatus.mockResolvedValue({ id: 'b-1', status: 'CONFIRMED' });
    const result = await controller.updateStatus('b-1', { status: 'CONFIRMED' } as any);
    expect(result.status).toBe('CONFIRMED');
  });

  it('should cancel a booking', async () => {
    mockBookingsService.cancel.mockResolvedValue({ id: 'b-1', status: 'CANCELLED' });
    const result = await controller.cancel('b-1');
    expect(result.status).toBe('CANCELLED');
  });
});
