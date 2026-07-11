import { ValidationPipe } from '@nestjs/common';

export const ServicesValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
