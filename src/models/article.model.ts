import mongoose, { Schema } from "mongoose";
import ArticleState, { CommentState } from "../interfaces/article";

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    default: [],
  },
  tagList: {
    type: Array,
    required: true,
  },
  author: {
    type: Object,
    required: true,
    username: {
      type: String,
    },
    image: String,
    bio: String,
  },
  favoritesCount: {
    type: Number,
    required: true,
    default: 0,
  },
  favorited: {
    type: Array,
    required: true,
    default: [],
  },
});
export default mongoose.model<ArticleState>("articles", ArticleSchema);
