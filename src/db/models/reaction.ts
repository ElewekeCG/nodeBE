import { model, Schema, Types } from "mongoose";

const ReactionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: [true, "Please provide a post id"],
    },
    type: {
      type: String,
      enum: ["like"],
      default: "like",
      required: [true, "Please provide a reaction type"],
    },
  },
  { timestamps: true }
);

ReactionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    type: this.type,
  };
};

interface ReactionDocument extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  reaction: ReactionType;
  toJSON: () => any;
}

enum ReactionType {
  like = "like",
}

export default model<ReactionDocument>("Reaction", ReactionSchema);