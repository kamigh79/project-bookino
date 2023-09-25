import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateUserDto } from '../../requests/user/update-user.dto';
import PasswordConfirmationException from '../../user/exceptions/password-confirmation.exception';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { UserGuard } from '../../guards/user.guard';
import UserNotFoundException from '../../user/exceptions/user-not-found.exception';
import { UpdateUserProfileDto } from '../../requests/user/update-user-profile.dto';
import { UserProfileService } from '../../user/services/user-profile.service';
import { validateAddress } from '../../requests/user/update-user-address.dto';
import InvalidAddressException from '../../user/exceptions/invalid-address.exception';
import { ApiTags } from '@nestjs/swagger';
import { ChangeUserPasswordDto } from '../../requests/user/change-user-password.dto';
import PasswordIncorrectException from '../../user/exceptions/password-incorrect.exception';
import UserIsDeletedException from 'src/user/exceptions/user-is-deleted.exception';

@ApiTags('user')
@Controller('user')
@UseGuards(UserGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: UserProfileService,
  ) {}

  @Get('/:id')
  async show(
    @Request() req,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findById(params.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const result = user.toObject();
    delete result['password'];

    return {
      message: i18n.t('user.show.success'),
      data: result,
    };
  }

  @Get('/')
  async showProfile(
    @Request() req,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findById(req.user.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const profile = await this.profileService.findByUserId(req.user.id);

    const result = user.toObject();
    delete result.password;
    result['profile'] = profile ? profile.toObject() : null;
    return {
      message: i18n.t('user.show.success'),
      data: result,
    };
  }

  @Put('/')
  async update(
    @Request() req,
    @Body() inputs: UpdateUserDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    if (inputs.password) {
      if (inputs.password !== inputs.password_confirmation) {
        throw new PasswordConfirmationException(
          i18n.t('user.update.failed.password_confirmation'),
        );
      } else {
        inputs.password = await bcrypt.hash(
          inputs.password,
          parseInt(process.env.SALT_OR_ROUND),
        );
        delete inputs.password_confirmation;
      }
    }

    await this.userService.update(req.user._id, inputs);
    return {
      message: i18n.t('user.update.success'),
      data: true,
    };
  }

  @Put('/profile')
  async profile(
    @Request() req,
    @Body() inputs: UpdateUserProfileDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    if (inputs.address) {
      if (!validateAddress(inputs.address.province, inputs.address.city)) {
        throw new InvalidAddressException('province or city is invalid.');
      }
    }

    await this.profileService.update(req.user._id, inputs);
    return {
      message: i18n.t('user.profile.success'),
      data: true,
    };
  }

  @Put('/change-password')
  async changePassword(
    @Request() req,
    @Body() inputs: ChangeUserPasswordDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findById(req.user.id);

    if (
      !user.password ||
      !(await bcrypt.compare(inputs.oldPassword, user.password))
    ) {
      throw new PasswordIncorrectException('Old password is incorrect.');
    }

    if (inputs.newPassword !== inputs.newPasswordConfirmation) {
      throw new PasswordConfirmationException(
        i18n.t('user.update.failed.password_confirmation'),
      );
    }

    const newHashPassword = await bcrypt.hash(
      inputs.newPassword,
      parseInt(process.env.SALT_OR_ROUND),
    );

    await this.userService.update(user.id, {
      password: newHashPassword,
    });

    return {
      message: i18n.t('user.change-password.success'),
      data: true,
    };
  }

  @Delete('/:id')
  async delete(
    @Request() req,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findById(params.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.deletedAt) {
      throw new UserIsDeletedException();
    }

    const result = await this.userService.delete(params.id);

    return {
      message: i18n.t('user.delete.success'),
      data: result,
    };
  }
}
