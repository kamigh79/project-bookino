import { BaseException } from '../../../exceptions/base.exception';

export default class IncorrectOtpException extends BaseException {
  constructor(message = '', data = {}) {
    super(message);
    this.data = data;
    this.statusCode = 400;
  }
}
