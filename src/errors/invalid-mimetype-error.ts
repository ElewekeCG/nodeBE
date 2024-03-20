import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class InvalidMimeTypeError extends CustomApiError{
  constructor(message: string = "Invalid MimeType") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}