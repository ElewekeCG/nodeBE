import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class OriginalPostIdMissingError extends CustomApiError {
  constructor(message: string = "Original Post id missing") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}