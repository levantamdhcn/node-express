"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const signJWT_1 = __importDefault(require("../functions/signJWT"));
const refreshToken_1 = __importDefault(require("../functions/refreshToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
let refreshTokens = [];
const NAMESPACE = "user";
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, "Token validated, user authorized");
    return res.status(200).json({
        message: "Authorized",
    });
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { username, password, email } = req.body;
        const duplicatUserNameAccount = yield user_model_1.default.find({ username });
        const duplicatEmailAccount = yield user_model_1.default.find({ email });
        if (duplicatEmailAccount.length < 1 || duplicatUserNameAccount.length < 1) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hased = yield bcrypt_1.default.hash(password, salt);
            // INSERT USER TO DB
            const newUser = new user_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId().toString(),
                username,
                email,
                password: hased,
            });
            return newUser.save().then((user) => {
                return res.status(200).json(user);
            });
        }
        else {
            return res.status(403).json({
                message: "User has been taken",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        else {
            const validAccount = yield bcrypt_1.default.compare(password, user.password);
            if (validAccount) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            else {
                (0, signJWT_1.default)(user, (_error, token) => __awaiter(void 0, void 0, void 0, function* () {
                    if (_error) {
                        return res.status(403).json({
                            message: _error.message,
                            error: _error,
                        });
                    }
                    else if (token) {
                        const newRefreshToken = (0, refreshToken_1.default)(user);
                        refreshTokens.push(newRefreshToken);
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token,
                            refreshToken: newRefreshToken,
                            user: user,
                        });
                    }
                }));
            }
        }
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
const refreshTokenControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken = req.body.refreshToken;
    console.log("refresh", refreshTokens);
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json({
            message: "AccessToken expired",
        });
    }
    else {
        jsonwebtoken_1.default.verify(refreshToken, config_1.default.server.token.refreshSecret, (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    message: error.message,
                    error,
                });
            }
            else {
                jsonwebtoken_1.default.verify(refreshToken, config_1.default.server.token.refreshSecret, (err, data) => {
                    if (err) {
                        res.status(403);
                    }
                    else {
                        const accessToken = (0, signJWT_1.default)(data, (error, token) => {
                            if (error) {
                                res.status(403);
                            }
                            else {
                                res.status(200).json({
                                    accessToken: token,
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
const logout = (req, res) => {
    const refreshToken = req.body.refreshtoken;
    refreshTokens = refreshTokens.filter((el) => el !== refreshToken);
    console.log("logout", refreshToken);
    res.status(200).json({
        message: "Logged out",
    });
};
exports.default = { validateToken, register, login, logout, refreshTokenControl };
