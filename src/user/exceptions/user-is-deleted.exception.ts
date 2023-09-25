import { BaseException } from '../../exceptions/base.exception';

export default class UserIsDeletedException extends BaseException {
  constructor(data = {}) {
    super('User is deleted.');
    this.data = data;
    this.statusCode = 400;
  }
}
