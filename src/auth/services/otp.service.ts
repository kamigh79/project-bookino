import { Otp, OtpDocument } from '../models/otp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {
  }

  async create(otp: Otp) {
    const newOtp = new this.otpModel(otp);

    await newOtp.save();

    return newOtp;
  }

  async update(id: string, data: any) {
    return this.otpModel.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      {
        returnDocument: 'after',
      },
    );
  }

  async index(filters, sorts, pagination) {
    return this.otpModel
      .find(filters)
      .sort(sorts)
      .skip((pagination.page - 1) * pagination.perPage)
      .limit(pagination.perPage);
  }


  async findByIdentifier(email: string) {
    return this.otpModel.findOne({
      identifier: email,
      deletedAt: {
        $exists: false,
      },
    });
  }

  async delete(id: string) {
    return this.update(id, {
      deletedAt: new Date(),
    });
  }
}