"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = "Auth";
const verifyToken = (req, res) => {
    logging_1.default.info(NAMESPACE, "Refreshing Token");
};
exports.verifyToken = verifyToken;
