export class BaseException extends Error {
  protected statusCode = 400;
  protected data = {};

  constructor(message) {
    super(message);
  }

  getErrorMessage() {
    return this.message;
  }

  getErrorCode() {
    return this.statusCode;
  }

  getErrorData() {
    return this.data;
  }
}
