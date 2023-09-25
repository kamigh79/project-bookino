import {
  Body,
  Controller,
  Post,
  Request,
  SetMetadata,
  UseGuards,
  Put,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserGuard } from '../../guards/user.guard';
import { ApiTags } from '@nestjs/swagger';
import { BookService } from 'src/book/services/book.service';
import { CreateBookDto } from 'src/requests/book/create-book.dto';
import appConfig from 'src/config/app.config';
import { UpdateBookDto } from 'src/requests/book/update-book.dto';
import { IndexBookQueryDto } from 'src/requests/book/index-book-query.dto';
import { UserService } from 'src/user/services/user.service';
@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly userService: UserService,
  ) {}
  @UseGuards(UserGuard)
  @Post('/')
  async create(
    @Request() req,
    @Body() inputs: CreateBookDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const userInfo = await this.userService.findById(req.user.id);
    const payLoad = {
      phoneNumber: userInfo.phoneNumber,
      email: userInfo.email,
    };
    const book = {
      ownerId: req.user.id,
      payLoad,
      ...inputs,
    };
    const result = await this.bookService.create(book);

    return {
      message: i18n.t('book.create.success'),
      data: result,
    };
  }
  @Get('/')
  async index(
    @Request() req,
    @Query() query: IndexBookQueryDto,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const {
      page,
      perPage,
      sortKey,
      sortValue,
      createdAtLt,
      createdAtGte,
      ...filters
    } = query;
    let sorts = [['createdAt', -1]];
    let pagination = {
      perPage: appConfig.pagination.perPage,
      page: 1,
    };

    if (createdAtLt && createdAtGte) {
      filters['createdAt'] = {
        $gte: createdAtGte,
        $lt: createdAtLt,
      };
    }

    if (sortKey && sortValue) {
      sorts = [[sortKey, parseInt(sortValue)]];
    }

    if (page && perPage) {
      pagination = {
        perPage: parseInt(perPage),
        page: parseInt(page),
      };
    }

    const books = await this.bookService.index(filters, sorts, pagination);

    return {
      message: i18n.t('book.index.success'),
      data: books,
    };
  }

  @UseGuards(UserGuard)
  @Put('/:id')
  async edit(
    @Request() req,
    @Body() inputs: UpdateBookDto,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const book = {
      ownerId: req.user.id,
      ...inputs,
    };
    const result = await this.bookService.update(params.id, book);

    return {
      message: i18n.t('book.update.success'),
      data: result,
    };
  }

  @UseGuards(UserGuard)
  @Get('/user')
  async showUserBooks(
    @Request() req,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const books = await this.bookService.findByUserId(req.user.id);
    return {
      message: i18n.t('book.show.success'),
      data: books,
    };
  }

  @Get('/:id')
  async show(
    @Request() req,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<object> {
    const book = await this.bookService.findById(params.id);
    return {
      message: i18n.t('book.show.success'),
      data: book,
    };
  }
}
