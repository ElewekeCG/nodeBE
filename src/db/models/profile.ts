import { Document, Schema, Types, model } from "mongoose";

const profileSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    bio: {
      type: String,
      maxlength: [500, "Your bio cannot exceed 500 characters"],
      trim: true,
      required: false,
    },
    location: {
      type: String,
      maxlength: [60, "Your location cannot exceed 60 characters"],
      trim: true,
      required: false,
    },
    website: {
      type: String,
      maxlength: [200, " Your website cannot exceed 200 characters"],
      trim: true,
      required: false,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        "Please provide a valid URL",
      ],
    },
  },
  {timestamps: true}
);

// converting profile to json
profileSchema.methods.toJSON = function (): any {
  return {
    bio: this.bio,
    location: this.location,
    website: this.website,
  };
};

interface ProfileDocument extends Document {
  userId: Types.ObjectId;
  bio?: string;
  location?: string;
  website?: string;
  toJSON: () => any;
}

export default model<ProfileDocument>("Profile", profileSchema);