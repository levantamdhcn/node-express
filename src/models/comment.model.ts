import mongoose, { Schema } from "mongoose";
import { Comments, CommentState } from "../interfaces/article";

const CommentSchema: Schema = new Schema(
  {
    body: {
      type: String,
    },
    author: {
      type: Object,
      required: true,
      username: {
        type: String
      },
      image: String,
      bio: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<CommentState>("comments", CommentSchema)
