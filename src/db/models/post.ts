import { Document, Schema, Types, model } from "mongoose";

const PostSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a valid user id"],
    },
    text: {
      type: String,
      maxlength: [500, "Your post cannot exceed 500 characters"],
      trim: true,
      required: false //not required for reposts
    },
    type: {
      type: String,
      enum:["post", "repost", "reply"],
      default: "post",
      required: false,
    },
    originalPostId: {
      type: Types.ObjectId,
      ref: "Post",
      required: false,
    },
    attachmentId: {
      type: Types.ObjectId,
      ref: "Attachment",
      required: false,
    },
  },
  { timestamps: true}
);

PostSchema.methods.toJSON = function (): any {
  return {
    id: this._id,
    userId: this.userId,
    text: this.text,
    type: this.type,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    attachmentId: this.attacmentId,
  };
};

interface PostDocument extends Document {
  userId: Types.ObjectId;
  text?: string;
  type: PostType;
  originalPostId?: Types.ObjectId;
  attachmentId?: Types.ObjectId;
  toJSON: () => any;
}

enum PostType {
  post = "post",
  repost = "repost",
  reply = "reply",
}

export default model<PostDocument>("Post", PostSchema);