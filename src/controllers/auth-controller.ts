import { StatusCodes } from "http-status-codes";

import {
  Body,
  Controller,
  Delete,
  OperationId,
  Post,
  Request, //this tells TSOA that we need to get the request object as a param into our logout endpoint
  Route,
  Security,
  Tags,
} from "tsoa";

// this request allows us to specify the data type of the request object itself
import { Request as ExpressRequest } from "express";

import {
  LoginParams,
  RefreshParams,
  UserAndCredentials,
  UserCreationParams,
} from "../services/models/auth-models";

import AuthService from "../services/auth-service";

import AuthenticatedUser from "../middleware/models/authenticated-user";

@Route("/api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("register")
  @OperationId("registerUser")
  public async register(
    @Body() requestBody: UserCreationParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.CREATED);
    return new AuthService().register(requestBody);
  }

  @Post("login")
  @OperationId("loginUser")
  public async login(
    @Body() requestBody: LoginParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.OK);
    return new AuthService().login(requestBody);
  }

  @Delete()
  @Security("jwt")
  @OperationId("logoutUser")
  public async logout(@Request() request: ExpressRequest): Promise<void> {
    this.setStatus(StatusCodes.NO_CONTENT);
    const user = request.user as {jti: string};
    await new AuthService().logout(user.jti);
  }

  @Post("refresh")
  @Security("jwt_without_verification")
  @OperationId("refreshUser")
  public async refresh(
    @Request() request: ExpressRequest,
    @Body() requestBody: RefreshParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.OK);
    const user = request.user as AuthenticatedUser;
    return new AuthService().refresh(requestBody, user);
  }
}