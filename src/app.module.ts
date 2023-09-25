import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { TokenModule } from './token/jwt-module.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AuthController } from './controllers/auth/auth.controller';
import { BookController } from './controllers/book/book.controller';
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [
    UserModule,
    TokenModule,
    EmailModule,
    AuthModule,
    BookModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URI, {
      dbName: process.env.MONGO_DB_DATABASE,
      connectionFactory: (connection) => {
        if (connection.readyState) {
          console.log('Mongo database connected successfully.');
        }

        return connection;
      },
    }),
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [AppController, UserController, AuthController, BookController],
  providers: [AppService],
})
export class AppModule {}
