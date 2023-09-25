import { BaseException } from '../../exceptions/base.exception';

export default class UserDuplicateException extends BaseException {
  constructor(data = {}) {
    super('User is already created.');
    this.data = data;
    this.statusCode = 400;
  }
}
