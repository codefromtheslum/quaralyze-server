import { iPost } from "../utils/interface";
import { Document, model, Schema, Types } from "mongoose";

interface iPostData extends iPost, Document {}

const postModel = new Schema<iPostData>(
  {
    image: { type: String },
    imageId: { type: String },
    authorId: { type: Types.ObjectId, ref: "users", required: true },
    text: { type: String },
    likes: [
      {
        type: Types.ObjectId,
      },
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  { timestamps: true }
);

export default model<iPostData>("posts", postModel);
