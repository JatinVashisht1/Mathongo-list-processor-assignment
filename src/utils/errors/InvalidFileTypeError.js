import { HTTPStatusCodes } from "../http-status-codes.js";

export class InvalidFileTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = HTTPStatusCodes.BAD_REQUEST;
  }
}
