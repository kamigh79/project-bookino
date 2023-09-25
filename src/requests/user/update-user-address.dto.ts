import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import ProvinceCitiesEnum from '../../user/enums/province-cities.enum';

export class UpdateUserAddressDto {
  @ApiPropertyOptional()
  @IsString()
  province: string;

  @ApiPropertyOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;
}

export function validateAddress(province, city) {
  return (
    ProvinceCitiesEnum[province] && ProvinceCitiesEnum[province].includes(city)
  );
}
