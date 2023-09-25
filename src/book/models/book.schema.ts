import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({
  timestamps: true,
})
export class Book {
  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  price?: number;

  @Prop()
  description?: string;

  @Prop()
  grade?: string;

  @Prop()
  major?: string;

  @Prop()
  publisher?: string;

  @Prop()
  condition?: string;

  @Prop()
  image?: string;

  @Prop()
  publicationDate?: number;

  @Prop({ type: Object })
  payLoad?: Object;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
