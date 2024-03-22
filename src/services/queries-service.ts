import Post from "../db/models/post";
import Reaction from "../db/models/reaction";
import { 
  PostType, 
  Post as TSOAPostModel,
  Reaction as TSOAReactionModel,
} from "./models/posts-models";

import { 
  GetRepliesParams,
  GetUserReactionsParams,
  PostStatsResponse,
  PostsResponse, 
  QueryPostsParams, 
  ReactionsResponse,
} from "./models/queries-models";
const { max, min } = Math;

export default class QueriesService {
  public async queryPosts(
    params: QueryPostsParams,
    requestUserId: String
  ): Promise<PostsResponse> {
    const userId = params.userId || requestUserId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;
    const type = params.type || PostType.post;

    const skip = resultsPerPage * page;
    const posts = await Post.find({ userId, type }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: {createdAt: -1},
    });

    const totalPosts = await Post.countDocuments({userId, type});
    const remainingCount = max(totalPosts - (page + 1) * resultsPerPage, 0);
    const remaingPages = Math.ceil(remainingCount / resultsPerPage);

    return {
      remainingCount: remainingCount, 
      remainingPages: remaingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReplies(params: GetRepliesParams): Promise<PostsResponse> {
    const postId = params.postId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page?? 0;

    const skip = resultsPerPage * page;
    const type = "reply";
    const posts = await Post.find({ type, originalPostId: postId }, null, {
      skip: skip,
      limit: resultsPerPage,
    });

    const totalPosts = await Post.countDocuments({
      type,
      originalPostId: postId,
    });
    const remainingCount = max(totalPosts - (page + 1) * resultsPerPage, 0);
    const remaingPages = Math.ceil(remainingCount / resultsPerPage);

    return {
      remainingCount: remainingCount,
      remainingPages: remaingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReactions(
    params: GetUserReactionsParams,
    requestUserId: String
  ): Promise<ReactionsResponse>{
    const userId = params.userId || requestUserId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;
    const skip = resultsPerPage * page;

    const reactions = await Reaction.find({ userId }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1},
    });

    const totalReactions = await Reaction.countDocuments({userId});
    const remainingCount = max(totalReactions - (page + 1) * resultsPerPage, 0);
    const remaingPages = Math.ceil(remainingCount / resultsPerPage);

    
    return {
      remainingCount: remainingCount,
      remainingPages: remaingPages,
      count: reactions.length,
      reactions: reactions.map(
        (reaction) => reaction.toJSON() as TSOAReactionModel
      ),
    };
  }

  public async getPostStats(postId: String): Promise<PostStatsResponse> {
    const reactionCount = await Reaction.countDocuments({ postId });
    const replyCount = await Post.countDocuments({
      originalPostId: postId,
      type: "reply",
    });
    const repostCount = await Post.countDocuments({
      originalPostId: postId,
      type: "repost",
    });

    return { reactionCount, replyCount, repostCount };
  }
}