"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    author: {
        image: String,
        username: String,
    },
    body: {
        type: String,
    },
}, { timestamps: true });
