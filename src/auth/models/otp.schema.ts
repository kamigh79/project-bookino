import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  code: number;

  @Prop({ required: true })
  secret: string;

  @Prop({ type: Object })
  payload?: any;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
