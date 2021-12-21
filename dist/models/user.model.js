"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Users", UserSchema);
