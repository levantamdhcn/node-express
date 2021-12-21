"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    maxPoolSize: 50,
    autoIndex: false,
    retryWrites: true,
};
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_URL ||
    `cluster0.rrnzf.mongodb.net/conduitDatabase?retryWrites=true&w=majority`;
const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superscret";
const SERVER_REFRESH_TOKEN_SECRET = process.env.SERVER_REFRESH_TOKEN_SECRET || "refreshtokenscret";
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET,
        refreshSecret: SERVER_REFRESH_TOKEN_SECRET,
    },
};
const config = {
    mongo: MONGO,
    server: SERVER,
};
exports.default = config;
