import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Men haircut', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
