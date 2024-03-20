import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class PhotoNotFoundError extends CustomApiError{
  constructor(message: string = "Photo not found") {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}