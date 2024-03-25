import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  DeleteUserResponse,
  SetUsernameParams,
  SetUsernameResponse,
} from "../services/models/user-models";

import {
  Body,
  Controller,
  Delete,
  OperationId,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import UserService from "../services/user-service";
import AuthService from "../services/auth-service";

@Route("/api/v1/user")
@Tags("User")
export class UserController extends Controller {
  /**
   * Set the username of the authenticated user.
   */
  @Post("/username")
  @OperationId("setUsername")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  @Security("jwt")
  public async setUsername(
    @Request() request: ExpressRequest,
    @Body() params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const { id: userId } = request.user as AuthenticatedUser;

    return new UserService().setUsername(userId, params);
  }

  @Delete("")
  @OperationId("deleteUser")
  @Response(StatusCodes.OK)
  @Security("jwt")
  public async deleteUser(
    @Request() request: ExpressRequest
  ): Promise<DeleteUserResponse> {
    const { id: userId, jti } = request.user as AuthenticatedUser;

    const result = new UserService().deleteUser(userId);

    // also log the user out
    await new AuthService().logout(jti);

    return result;
  }
}