import { iUser } from "../utils/interface";
import { Document, Schema, model, Types } from "mongoose";

interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    emailAddress: { type: String, required: true },
    facebookURL: { type: String },
    instagramURL: { type: String },
    twitterURL: { type: String },
    linkedinURL: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    gender: { type: String },
    country: { type: String },
    state: { type: String },
    occupation: { type: String },
    posts: [
      {
        type: Types.ObjectId,
        ref: "posts",
      },
    ],
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
