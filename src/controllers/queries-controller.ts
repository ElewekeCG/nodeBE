import { StatusCodes } from "http-status-codes";
import {
  Controller,
  Get,
  OperationId,
  Path,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

import * as express from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import { 
  PostsResponse,
  PostStatsResponse,
  ReactionsResponse,
} from "../services/models/queries-models";

import { PostType } from "../services/models/posts-models";

import QueriesService from "../services/queries-service";

@Route("/api/v1/query")
@Tags("Queries")
export class QueriesController extends Controller {
  /**
   * Retrieves posts with given parameters, with pagination.
   */
  @Get("/posts")
  @OperationId("queryPosts")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async queryPosts(
    @Request() request: express.Request,
    @Query() userId?: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number,
    @Query() type?: PostType
  ): Promise<PostsResponse> {
    const user = request.user as AuthenticatedUser;
    const resolvedUserId = userId ?? user.id;
    return new QueriesService().queryPosts(
      {
        userId: resolvedUserId,
        resultsPerPage,
        page,
        type,
      },
      resolvedUserId
    );
  }

  @Get("/replies/{postId}")
  @OperationId("getReplies")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReplies(
    @Path() postId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<PostsResponse> {
    return new QueriesService().getReplies({
      postId,
      resultsPerPage,
      page,
    });
  }

  @Get("/reactions/{userId}")
  @OperationId("getReactions")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReactions(
    @Request() request: express.Request,
    @Path() userId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<ReactionsResponse> {
    const user = request.user as AuthenticatedUser;
    const requestUserId = user.id;
    return new QueriesService().getReactions(
      {
        userId, 
        resultsPerPage,
        page,
      },
      requestUserId
    );
  }

  @Get("/reactions")
  @OperationId("getCurrentUserReactions")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getCurrentUserReactions(
    @Request() request: express.Request,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<ReactionsResponse> {
    return this.getReactions(
      request,
      "undefined",
      resultsPerPage, 
      page
    );
  }

  @Get("/stats/{postId}")
  @OperationId("getPostStats")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getPostStats(
    @Path()postId: string
  ): Promise<PostStatsResponse>{
    return new QueriesService().getPostStats(postId);
  }
}