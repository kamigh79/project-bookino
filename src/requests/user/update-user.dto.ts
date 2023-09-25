import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import UserConfig from '../../config/user.config';

export class UpdateUserDto {
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
  @MinLength(UserConfig.password.min_length)
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @MinLength(UserConfig.password.min_length)
  @IsString()
  @IsOptional()
  password_confirmation?: string;
}
