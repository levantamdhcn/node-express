import mongoose, { Schema } from "mongoose";
import ArticleState from "../interfaces/article";

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tagList: {
    type: Array,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  favoriteCount: {
    type: Number,
    required: true,
    default: 0,
  },
  favorited: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default ArticleSchema;
