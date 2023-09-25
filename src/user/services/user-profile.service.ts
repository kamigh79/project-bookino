import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserProfile,
  UserProfileDocument,
} from '../models/user-profile.schema';

export class UserProfileService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly profileModel: Model<UserProfileDocument>,
  ) {}

  async create(inputs: UserProfile) {
    const result = new this.profileModel(inputs);

    await result.save();

    return result;
  }

  async findById(id: string) {
    return await this.profileModel.findById(id).exec();
  }

  async findByUserId(userId: string) {
    return await this.profileModel
      .findOne({
        userId: userId,
      })
      .exec();
  }

  async index(filters, sorts, pagination) {
    return this.profileModel
      .find(filters)
      .sort(sorts)
      .skip((pagination.page - 1) * pagination.perPage)
      .limit(pagination.perPage);
  }

  async update(userId, data: any) {
    return this.profileModel.findOneAndUpdate(
      {
        userId: userId,
      },
      data,
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
  }
}
