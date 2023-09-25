import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  exports: [JwtModule],
})
export class TokenModule {}
