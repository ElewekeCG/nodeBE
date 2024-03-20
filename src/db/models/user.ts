import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Document, model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    maxlength: [30, "Your name cannot exceed 30 characters"],
    minlength: [3, "Your name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be at least 6 characters long"],
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    unique: true,
    maxlength: [30, "Your username cannot exceed 30 characters"],
    minlength: [3, "Your username must be at least 3 characters long"],
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.createJWT = function (uuid: string): string {
  const token = jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
      issuer: process.env.JWT_ISSUER,
      jwtid: uuid,
    }
  );
  return token;
};

UserSchema.methods.createRefresh = function (uuid: string): string {
  const refreshToken = jwt.sign(
    { userId: this._id, email: this.email },
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRES,
      issuer: process.env.JWT_ISSUER,
      jwtid: uuid,
    }
  );
  return refreshToken;
};

UserSchema.methods.toJSON = function (): any {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
  };
};

UserSchema.methods.comparePassword = function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  username: string;
  createJWT: (uuid: string) => string;
  createRefresh: (uuid: string) => string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  toJSON: () => any;
}

export default model<UserDocument>("User", UserSchema);
