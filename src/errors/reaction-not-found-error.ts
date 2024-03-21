import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-error";

export class ReactionNotFoundError extends CustomApiError {
  constructor(message: string = "Reaction not found") {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}