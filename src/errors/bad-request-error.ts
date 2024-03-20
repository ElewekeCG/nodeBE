import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class BadRequestError extends CustomApiError {
  constructor(message: string = "Bad Request") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
