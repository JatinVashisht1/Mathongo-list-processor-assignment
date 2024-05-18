import { HTTPStatusCodes } from "../http-status-codes.js";

/**
 * Class representing duplicate record error.
 * @extends {Error}
 */
export class RecordAlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = HTTPStatusCodes.CONFLICT;
  }
}
