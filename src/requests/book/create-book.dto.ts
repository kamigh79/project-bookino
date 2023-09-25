import { IsOptional, IsString, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  title: string;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  major?: string;

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  publicationDate?: number;
}
