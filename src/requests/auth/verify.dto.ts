import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty()
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsString()
  identifier: string;

  @ApiProperty()
  @IsString()
  secret: string;
}
