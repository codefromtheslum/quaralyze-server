import { Document, model, Schema, Types } from "mongoose";
import { iReply } from "../utils/interface";

interface iReplyData extends iReply, Document {}

const replyModel = new Schema<iReplyData>(
  {
    authorId: { type: Types.ObjectId, ref: "users" },
    text: { type: String, required: true },
    likes: [
      {
        types: Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default model<iReplyData>("replies", replyModel);
