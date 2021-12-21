"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    refreshTokens: {
        type: Array,
        default: [],
    },
});
exports.default = mongoose_1.default.model("refreshToken", refreshTokenSchema);
