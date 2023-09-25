import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class IndexUserQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

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
