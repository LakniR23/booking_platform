import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  service: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const dto = { title: 'Haircut', description: 'Basic haircut', duration: 30, price: 20, isActive: true };
      mockPrismaService.service.create.mockResolvedValue({ id: 'svc-1', ...dto });
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 'svc-1');
      expect(result.title).toBe('Haircut');
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      mockPrismaService.service.findMany.mockResolvedValue([{ id: 'svc-1' }, { id: 'svc-2' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should return the service if found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1', title: 'Haircut' });
      const result = await service.findOne('svc-1');
      expect(result).toHaveProperty('title', 'Haircut');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);
      await expect(service.update('bad-id', { title: 'New' })).rejects.toThrow(NotFoundException);
    });

    it('should update a service', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1', title: 'Haircut' });
      mockPrismaService.service.update.mockResolvedValue({ id: 'svc-1', title: 'New Haircut' });
      const result = await service.update('svc-1', { title: 'New Haircut' });
      expect(result.title).toBe('New Haircut');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should delete a service', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrismaService.service.delete.mockResolvedValue({ id: 'svc-1' });
      const result = await service.remove('svc-1');
      expect(result).toHaveProperty('id', 'svc-1');
    });
  });
});
