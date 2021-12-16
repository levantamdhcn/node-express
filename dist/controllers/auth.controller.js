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
        const salt = yield bcrypt_1.default.genSalt(10);
        const hased = yield bcrypt_1.default.hash(password, salt);
        // INSERT USER TO DB
        const newUser = new user_model_1.default({
            id: new mongoose_1.default.Types.ObjectId(),
            username,
            email,
            password: hased,
        });
        return newUser.save().then((user) => {
            return res.status(200).json(user);
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const login = (req, res, next) => {
    let { username, password } = req.body;
    user_model_1.default.find({ username })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        bcrypt_1.default.compare(password, users[0].password, (_error, result) => {
            if (_error) {
                logging_1.default.error(NAMESPACE, "Unable to sign token: ", _error);
                return res.status(401).json({
                    message: "Unauthorized",
                    erorr: _error,
                });
            }
            else if (result) {
                (0, signJWT_1.default)(users[0], (_error, token) => {
                    if (_error) {
                        return res.status(500).json({
                            message: _error.message,
                            error: _error,
                        });
                    }
                    else if (token) {
                        return res.status(500).json({
                            message: "Auth successful",
                            token: token,
                            user: users[0],
                        });
                    }
                });
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
};
exports.default = { validateToken, register, login };
