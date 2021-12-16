import mongoose, { Schema } from "mongoose";
import UserState from "../interfaces/user";

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: String,
      required: false,
      default: "https://api.realworld.io/images/smiley-cyrus.jpeg",
    },
    following: {
      type: Array,
      required: false,
      default: [],
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserState>("Users", UserSchema);
