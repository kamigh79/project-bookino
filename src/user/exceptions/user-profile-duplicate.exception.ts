import { BaseException } from '../../exceptions/base.exception';

export default class UserProfileDuplicateException extends BaseException {
  constructor(data = {}) {
    super('User profile is already created.');
    this.data = data;
    this.statusCode = 400;
  }
}
