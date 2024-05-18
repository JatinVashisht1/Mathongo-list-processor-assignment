import { HTTPStatusCodes } from "../http-status-codes.js";

export class RecordNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = HTTPStatusCodes.NOT_FOUND;
  }
}
