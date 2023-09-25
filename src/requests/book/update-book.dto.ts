import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPositive } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;
}
