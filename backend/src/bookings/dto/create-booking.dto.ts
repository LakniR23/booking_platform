import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../../generated/prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'service-uuid-here' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'bookingDate must be in YYYY-MM-DD format' })
  bookingDate: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'bookingTime must be in HH:MM format' })
  bookingTime: string;

  @ApiProperty({ example: 'Please prepare water.', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
