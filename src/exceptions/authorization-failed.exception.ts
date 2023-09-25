import { BaseException } from './base.exception';

export default class AuthorizationFailedException extends BaseException {
  constructor(message = '', data = {}) {
    super(message);
    this.data = data;
    this.statusCode = 401;
  }
}
