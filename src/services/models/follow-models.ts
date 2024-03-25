import { User } from "./auth-models";

export interface Follow {
  id: string;
  followerUserId: string;
  followingUserId: string;
  createdAt: Date;
  updatedAt: Date;
  following?: User;
  follower?: User;
}

export interface FollowUnfollowUserParams {
  followerUserId: string;
  followingUserId: string;
}


export interface GetFollowingsOrFollowersParams {
  userId: string;
  resultsPerPage?: number;
  page?: number;
}

export interface FollowsResponse {
  remainingCount: number;
  remainingPages: number;
  count: number;
  follows: Follow[];
}