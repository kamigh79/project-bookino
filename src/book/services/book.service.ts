import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from '../models/book.schema';

export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(book: Book) {
    const newBook = new this.bookModel(book);

    await newBook.save();

    return newBook;
  }

  async update(id: number, data: any) {
    return this.bookModel.findOneAndUpdate(
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
    return this.bookModel
      .find(filters)
      .sort(sorts)
      .skip((pagination.page - 1) * pagination.perPage)
      .limit(pagination.perPage);
  }

  // async findBookAndOwner(){
  //   const result = await this.bookModel.aggregate([{
  //     $lookup: {
  //             from: "users",
  //             localField: "ownerId",
  //             foreignField: "_id",
  //             as: "userInfo"
  //         }
  // }])
  // }

  async findByUserId(userId: string) {
    return await this.bookModel
      .find({
        ownerId: userId,
      })
      .exec();
  }

  async findByTitle(title: string) {
    return await this.bookModel
      .find({
        title: title,
      })
      .exec();
  }

  async findById(id: string) {
    return await this.bookModel.findById(id).exec();
  }

  async delete(id) {
    return await this.update(id, {
      deletedAt: new Date(),
    });
  }
}
