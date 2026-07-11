import { ValidationPipe } from '@nestjs/common';

export const BookingValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
