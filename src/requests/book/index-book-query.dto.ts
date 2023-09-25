import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class IndexBookQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  major?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  createdAtGte?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  createdAtLt?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  perPage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortKey?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortValue?: string;
}
