import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './models/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
    ]),
  ],

  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
