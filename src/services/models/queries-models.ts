import { 
  Post, 
  PostType, 
  Reaction,
} from "./posts-models";

export interface QueryPostsParams {
  userId?: string;
  resultsPerPage?: number;
  page?: number;
  type?: PostType;
}

export interface PostsResponse {
  remainingCount: number;
  remainingPages: number;
  count: number;
  posts: Post[];
}

export interface GetRepliesParams {
  postId: string;
  resultsPerPage?: number;
  page?: number;
}

export interface GetUserReactionsParams {
  userId?: string;
  resultsPerPage?: number;
  page?: number;
}

export interface ReactionsResponse {
  remainingCount: number;
  remainingPages: number;
  count: number;
  reactions: Reaction[];
}

export interface PostStatsResponse {
  reactionCount: number;
  replyCount: number;
  repostCount: number;
}