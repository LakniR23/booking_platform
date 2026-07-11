import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  verifyAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue(undefined),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');
  });

  describe('register', () => {
    const dto = { name: 'Alice', email: 'alice@example.com', password: 'pass123' };

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1', email: dto.email });
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should hash the password and create user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrisma.user.create.mockResolvedValue({
        id: 'u-1', name: 'Alice', email: dto.email, role: 'CUSTOMER',
      });

      const result = await service.register(dto);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(result.message).toBe('User registered successfully');
      expect(result.user.email).toBe(dto.email);
    });
  });

  describe('login', () => {
    const dto = { email: 'alice@example.com', password: 'pass123' };
    const storedUser = {
      id: 'u-1', email: dto.email, password: 'hashed', role: 'CUSTOMER',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(storedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token and refresh_token on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(storedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.login(dto);
      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result).toHaveProperty('refresh_token', 'mock-jwt-token');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: storedUser.id,
        email: storedUser.email,
        role: storedUser.role,
      });
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException for an invalid refresh token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('bad token'));
      await expect(service.refresh('bad')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user no longer exists', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'u-1', email: 'a@b.c', role: 'CUSTOMER' });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.refresh('good')).rejects.toThrow(UnauthorizedException);
    });

    it('should issue new tokens for a valid refresh token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'u-1', email: 'a@b.c', role: 'CUSTOMER' });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1', email: 'a@b.c', role: 'CUSTOMER' });
      const result = await service.refresh('good');
      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result).toHaveProperty('refresh_token', 'mock-jwt-token');
    });
  });
});
