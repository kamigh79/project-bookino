import { IsString, MinLength } from 'class-validator';
import UserConfig from '../../config/user.config';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDto {
  @ApiProperty()
  @MinLength(UserConfig.password.min_length)
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @MinLength(UserConfig.password.min_length)
  @IsString()
  newPassword: string;

  @ApiProperty()
  @MinLength(UserConfig.password.min_length)
  @IsString()
  newPasswordConfirmation: string;
}
