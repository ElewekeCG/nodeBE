import { StatusCodes } from "http-status-codes";
import PostsService from "../services/posts-service";

import {
  Body,
  Controller,
  Delete,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

import { Request as ExpressRequest } from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
  CreatePostParams,
  CreateReactionParams,
  Post as PostModel,
  Reaction as ReactionModel,
} from "../services/models/posts-models";

@Route("/api/v1/posts")
@Tags("Posts")
export class PostsController extends Controller {
  /**
   * Creates a new post, allows you to reply to an existing post or simply repost the original post.
   * For replies and reposts, the original post ID must be specified.
   * For a new post, the original post ID will be ignored.
   */
  @Post("")
  @OperationId("createPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.BAD_REQUEST, "Original post ID is missing")
  public async createPost(
    @Request() request: ExpressRequest,
    @Body() body: CreatePostParams
  ): Promise<PostModel> {
    const user = request.user as AuthenticatedUser;
    return new PostsService().createPost(user.id, body);
  }

  @Post("/react/{postId}")
  @OperationId("reactToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.NOT_FOUND, "Post not found")
  public async reactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest,
    @Body() body: CreateReactionParams
  ): Promise<ReactionModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostsService().reactToPost(userId, postId, body);
  }

  @Delete("/react/{postId}")
  @OperationId("unreactToPost")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND, "Reaction not found")
  public async unreactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<ReactionModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostsService().unreactToPost(userId, postId);
  }
}

