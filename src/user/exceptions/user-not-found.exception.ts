import { BaseException } from '../../exceptions/base.exception';

export default class UserNotFoundException extends BaseException {
  constructor(data = {}) {
    super('User not found.');
    this.data = data;
    this.statusCode = 400;
  }
}
