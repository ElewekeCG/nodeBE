import { StatusCodes } from "http-status-codes";
import PostsService from "../services/posts-service";

import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Patch,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

import { 
  Request as ExpressRequest, 
  Response as ExpressResponse,
} from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
  Attachment as AttachmentModel,
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

  
  /**
   * Attaches a photo to a post or a reply. Will throw an error if
   * the post is a repost (post.type == post | reply)
   * Can attach at most once. Once a photo is attached,
   * it cannot be changed or deleted.
   */
  @Patch("/{postId}")
  @OperationId("attachToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.INTERNAL_SERVER_ERROR, "Could not attach photo to post")
  @Response(StatusCodes.NOT_FOUND, "Post not found")
  public async attachToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<AttachmentModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostsService().attachToPost(userId, postId, request as any);
  }

  // getting an attachment from a post
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND, "photo not found")
  @Get("/attachment/{postId}")
  @OperationId("getPostAttachment")
  @Security("jwt")
  public async getPostAttachment(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<void> {
    const photoInfo = await new PostsService().getPostAttachment(postId);
    const response = request.res as ExpressResponse;
    return new Promise<void>((resolve, reject) => {
      response.sendFile(photoInfo.photoName, photoInfo.options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @Delete("/{postId}")
  @OperationId("deletePost")
  @Security("jwt")
  @Response(StatusCodes.OK, "Post deleted")
  @Response(StatusCodes.NOT_FOUND, "post not found")
  public async deletePost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<PostModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostsService().deletePost(userId, postId);
  }
}

