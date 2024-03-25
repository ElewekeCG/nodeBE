import Follow from "../db/models/follow";
import { BadRequestError } from "../errors";

const { max } = Math;

import {
  FollowUnfollowUserParams,
  FollowsResponse,
  GetFollowingsOrFollowersParams,
  Follow as TSOAFollowModel,
} from "./models/follow-models";

export default class FollowService {
  public async followUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const { followerUserId: userId, followingUserId } = params;

    // user cannot follow self
    if (userId === followingUserId) {
      throw new BadRequestError();
    }

    // are we already following this user?
    const existingFollow = await Follow.findOne({
      followerUserId: userId,
      followingUserId: followingUserId,
    });

    if (existingFollow) {
      throw new BadRequestError("Already following this user");
    }

    // create follow
    const follow = await Follow.create({
      followerUserId: userId,
      followingUserId: followingUserId,
    });

    return follow.toJSON() as TSOAFollowModel;
  }

  public async unfollowUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const deletedFollow = await Follow.findOneAndDelete(params);

    if (!deletedFollow) {
      throw new BadRequestError ("Not following this user");
    }

    return deletedFollow as unknown as TSOAFollowModel;
  }

  public async getUserFollowing(
    params: GetFollowingsOrFollowersParams
  ): Promise<FollowsResponse> {
    const { userId } = params;

    const resultsPerPage = params.resultsPerPage ?? 10;
    const page = params.page ?? 0;

    const skip = resultsPerPage * page;

    const follows = await Follow.find({ followerUserId: userId }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1 },
    });

    const totalFollows = await Follow.countDocuments({
      followerUserId: userId,
    });
    const remainingCount = max(totalFollows - (page + 1) * resultsPerPage, 0);
    const remaingPages = Math.ceil(remainingCount / resultsPerPage);

    // resolve references of the follow object
    // populating the virtual following field
    await Promise.all(
      follows.map(async (follow) => {
        await follow.populateFollowingField();
      })
    );

    return {
      remainingCount: remainingCount,
      remainingPages: remaingPages,
      count: follows.length,
      follows: follows.map((follow) => follow.toJSON()),
    };
  }

  public async getUserFollowers(
    params: GetFollowingsOrFollowersParams
  ): Promise<FollowsResponse> {
    const { userId } = params;

    const resultsPerPage = params.resultsPerPage ?? 10;
    const page = params.page ?? 0;

    const skip = resultsPerPage * page;

    const follows = await Follow.find({ followingUserId: userId }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1 },
    });

    const totalFollows = await Follow.countDocuments({
      followingUserId: userId,
    });
    const remainingCount = max(totalFollows - (page + 1) * resultsPerPage, 0);
    const remaingPages = Math.ceil(remainingCount / resultsPerPage);

    // resolve references of the follow object
    await Promise.all(
      follows.map(async (follow) => {
        await follow.populateFollowerField();
      })
    );

    return {
      remainingCount: remainingCount,
      remainingPages: remaingPages,
      count: follows.length,
      follows: follows.map((follow) => follow.toJSON()),
    };
  }
}