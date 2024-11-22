import { Document, model, Schema, Types } from "mongoose";
import { iComment } from "../utils/interface";

interface iCommentData extends iComment, Document {}

const commentModel = new Schema<iCommentData>(
  {
    authorId: { type: Types.ObjectId, ref: "users" },
    text: { type: String, required: true },
    likes: [
      {
        type: Types.ObjectId,
        ref: "likes",
      },
    ],
    replies: [
      {
        type: Types.ObjectId,
        ref: "replies",
      },
    ],
  },
  { timestamps: true }
);

export default model<iCommentData>("comments", commentModel);
