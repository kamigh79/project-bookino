import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User) {
    const newUser = new this.userModel(user);

    await newUser.save();

    return newUser;
  }

  async update(id: number, data: any) {
    return this.userModel.findOneAndUpdate(
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
    return this.userModel
      .find(filters)
      .sort(sorts)
      .skip((pagination.page - 1) * pagination.perPage)
      .limit(pagination.perPage);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async delete(id) {
    return await this.update(id, {
      deletedAt: new Date(),
    });
  }
}
