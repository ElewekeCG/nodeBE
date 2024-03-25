import { Document, Schema, Types, model } from "mongoose";
import User from "./user";

const FollowSchema = new Schema(
  {
    followerUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

FollowSchema.virtual("follower", {
  ref: "User",
  localField: "followerUserId",
  foreignField: "_id",
  justOne: true, 
}); 

FollowSchema.virtual("following", {
  ref: "User",
  localField: "followingUserId",
  foreignField: "_id",
  justOne: true,
}); 

FollowSchema.methods.populateFollowerField = async function () {
  await this.populate("follower");
};

FollowSchema.methods.populateFollowingField = async function () {
  await this.populate("following");
};

FollowSchema.methods.toJSON = function () {
  return {
    id: this._id,
    followerUserId: this.followerUserId,
    follower: this.follower,
    followingUserId: this.followingUserId,
    following: this.following,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

interface FollowDocument extends Document {
  followerUserId: Types.ObjectId;
  followingUserId: Types.ObjectId;
  follower?: typeof User;
  following?: typeof User;
  populateFollowerField: () => Promise <void>;
  populateFollowingField: () => Promise<void>;
  toJSON: () => any;
}

export default model<FollowDocument>("Follow", FollowSchema); 
