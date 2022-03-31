export class NotLoginedError extends Error {
  constructor() {
    super('Not logined');
    this.statusCode = 403;
  }
}