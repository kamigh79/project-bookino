import { Body, Controller, Post, Request } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../../requests/auth/login.dto';
import { OtpService } from '../../auth/services/otp.service';
import * as crypto from 'crypto';
import authConfig from '../../config/auth.config';
import { VerifyDto } from '../../requests/auth/verify.dto';
import { JwtService } from '@nestjs/jwt';
import { I18n, I18nContext } from 'nestjs-i18n';
import PasswordIncorrectException from '../../auth/exceptions/login/password-incorrect.exception';
import UserNotFoundException from '../../auth/exceptions/login/user-not-found.exception';
import ActiveOtpException from '../../auth/exceptions/login/active-otp.exception';
import InvalidOtpException from '../../auth/exceptions/verify/invalid-otp.exception';
import IncorrectOtpException from '../../auth/exceptions/verify/incorrect-otp.exception';
import ExpireOtpException from '../../auth/exceptions/verify/expire-otp.exception';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../email/email.service';
import { ApiTags } from '@nestjs/swagger';
import { renderFile } from 'ejs';
import { join } from 'path';
import { CreateUserDto } from 'src/requests/user/admin/create-user.dto';
import UserDuplicateException from 'src/user/exceptions/user-duplicate.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  @Post('signup')
  async signUp(
    @Request() req,
    @Body() inputs: CreateUserDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findByEmail(inputs.email);

    if (user) {
      throw new UserDuplicateException();
    }

    if (inputs.password) {
      inputs.password = await bcrypt.hash(
        inputs.password,
        parseInt(process.env.SALT_OR_ROUND),
      );
    }

    const result = await this.userService.create(inputs);
    delete result['password'];

    return {
      message: i18n.t('user.create.success'),
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() inputs: LoginDto,
    @Request() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const user = await this.userService.findByEmail(inputs.email);

    if (inputs.password) {
      if (user && user.password) {
        if (await bcrypt.compare(inputs.password, user.password)) {
          const token = this.jwtService.sign(user.toObject());
          return {
            message: i18n.t('auth.login.password.success'),
            data: {
              token: token,
              profile: !!user.password,
            },
          };
        } else {
          throw new PasswordIncorrectException(
            i18n.t('auth.login.password.failed.incorrect'),
          );
        }
      } else {
        throw new UserNotFoundException();
      }
    }

    const oldOtp = await this.otpService.findByIdentifier(inputs.email);

    if (oldOtp) {
      if (
        Math.floor(
          (new Date().getTime() - new Date(oldOtp.createdAt).getTime()) / 1000,
        ) > authConfig.otp.expire_time
      ) {
        await this.otpService.delete(oldOtp.id);
      } else {
        throw new ActiveOtpException(i18n.t('auth.login.otp.failed.active'));
      }
    }

    const otp = await this.otpService.create({
      code: Math.floor(100000 + Math.random() * 900000),
      identifier: inputs.email,
      secret: crypto.randomBytes(20).toString('hex'),
      payload: {
        ipAddress:
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress ||
          'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
      },
    });

    const emailBody = await renderFile(
      join(global.__basedir, 'views', 'otp.code.email.verification.ejs'),
      {
        firstName: user ? user.firstName : otp.identifier,
        email: otp.identifier,
        code: otp.code,
        ipAddress: otp.payload.ipAddress,
        userAgent: otp.payload.userAgent,
        createdAt: otp.createdAt,
      },
    );
    await this.emailService.send(
      otp.identifier,
      `${otp.code} is your verification code.`,
      emailBody,
    );

    return {
      message: i18n.t('auth.login.otp.success'),
      data: {
        secret: otp.secret,
        newUser: !user,
      },
    };
  }

  @Post('verify')
  async verify(
    @Body() inputs: VerifyDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const otp = await this.otpService.findByIdentifier(inputs.identifier);
    let user,
      token = null;

    if (!otp) {
      throw new InvalidOtpException(i18n.t('auth.verify.failed.invalid'));
    }

    if (
      Math.floor(
        (new Date().getTime() - new Date(otp.createdAt).getTime()) / 1000,
      ) < authConfig.otp.expire_time
    ) {
      if (otp.code === inputs.code && otp.secret === inputs.secret) {
        user = await this.userService.findByEmail(inputs.identifier);

        if (!user) {
          user = await this.userService.create({
            email: inputs.identifier,
            phoneNumber: '',
            password: '',
          });
        }

        token = this.jwtService.sign(user.toObject());
        await this.otpService.delete(otp.id);
      } else {
        throw new IncorrectOtpException(i18n.t('auth.verify.failed.incorrect'));
      }
    } else {
      await this.otpService.delete(otp.id);
      throw new ExpireOtpException(i18n.t('auth.verify.failed.expire'));
    }

    return {
      message: i18n.t('auth.verify.success'),
      data: {
        token: token,
        profile: !!user.password,
        verify: !!user.verifiedAt,
      },
    };
  }
}
