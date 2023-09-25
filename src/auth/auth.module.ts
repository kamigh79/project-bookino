import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OtpService } from './services/otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './models/otp.schema';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UserModule,
    MongooseModule.forFeature([
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class AuthModule {}
