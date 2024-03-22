import { Document, model, Schema, Types } from "mongoose";

const AttachmentSchema = new Schema(
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
    mimeType: {
      type: String,
      required: [true, "Please provide a mime type"],
    },
  },
  { timestamps: true }
);

AttachmentSchema.methods.toJSON = function (): any {
  return {
    id: this._id,
    mimeType: this.mimeType,
  };
};

interface AttachmentDocument extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  mimeType: string;
  toJSON: () => any;
}

export default model<AttachmentDocument>("Attachment", AttachmentSchema);