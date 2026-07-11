import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { BookingStatus } from '../../generated/prisma/client';

const mockPrismaService = {
  service: { findUnique: jest.fn() },
  booking: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = {
      serviceId: 'svc-1',
      bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      bookingTime: '10:00',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '1234567890',
      notes: '',
    };

    it('should throw NotFoundException if service does not exist', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for past booking date', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      const pastDto = { ...dto, bookingDate: '2000-01-01', bookingTime: '00:00' };
      await expect(service.create(pastDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate booking', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrismaService.booking.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should create a booking successfully', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrismaService.booking.findFirst.mockResolvedValue(null);
      mockPrismaService.booking.create.mockResolvedValue({ id: 'b-1', ...dto });
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 'b-1');
      expect(mockPrismaService.booking.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return paginated bookings with meta', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([{ id: 'b-1' }]);
      mockPrismaService.booking.count.mockResolvedValue(1);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if booking not found', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should return the booking if found', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue({ id: 'b-1' });
      const result = await service.findOne('b-1');
      expect(result).toHaveProperty('id', 'b-1');
    });
  });

  describe('updateStatus', () => {
    it('should throw BadRequestException when marking cancelled booking as completed', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue({ id: 'b-1', status: BookingStatus.CANCELLED });
      await expect(
        service.updateStatus('b-1', { status: BookingStatus.COMPLETED }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update booking status', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue({ id: 'b-1', status: BookingStatus.PENDING });
      mockPrismaService.booking.update.mockResolvedValue({ id: 'b-1', status: BookingStatus.CONFIRMED });
      const result = await service.updateStatus('b-1', { status: BookingStatus.CONFIRMED });
      expect(result.status).toBe(BookingStatus.CONFIRMED);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue({ id: 'b-1', status: BookingStatus.PENDING });
      mockPrismaService.booking.update.mockResolvedValue({ id: 'b-1', status: BookingStatus.CANCELLED });
      const result = await service.cancel('b-1');
      expect(result.status).toBe(BookingStatus.CANCELLED);
    });
  });
});
