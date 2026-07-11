import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should call register with dto', async () => {
    const dto = { name: 'Alice', email: 'alice@example.com', password: 'pass123' };
    mockAuthService.register.mockResolvedValue({ message: 'User registered successfully', user: dto });
    const result = await controller.register(dto);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(result.message).toBe('User registered successfully');
  });

  it('should call login with dto', async () => {
    const dto = { email: 'alice@example.com', password: 'pass123' };
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const result = await controller.login(dto);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(result.access_token).toBe('token');
  });

  it('should call refresh with the refresh token', async () => {
    mockAuthService.refresh.mockResolvedValue({ access_token: 'new-access', refresh_token: 'new-refresh' });
    const result = await controller.refresh({ refresh_token: 'old-refresh' });
    expect(mockAuthService.refresh).toHaveBeenCalledWith('old-refresh');
    expect(result.access_token).toBe('new-access');
  });
});
