import {
  IsDate,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateUserAddressDto } from './update-user-address.dto';

export class UpdateUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserAddressDto)
  address?: UpdateUserAddressDto;
}
