import { ValidationPipe } from '@nestjs/common';

export const AuthValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});