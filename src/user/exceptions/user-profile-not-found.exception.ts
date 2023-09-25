import { BaseException } from '../../exceptions/base.exception';

export default class UserProfileNotFoundException extends BaseException {
  constructor(data = {}) {
    super('User profile not found.');
    this.data = data;
    this.statusCode = 400;
  }
}
