"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
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
exports.default = ArticleSchema;
