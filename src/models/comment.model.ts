import mongoose, { Schema } from "mongoose";

const CommentSchema: Schema = new Schema(
  {
    author: {
      image: String,
      username: String,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);
