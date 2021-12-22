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
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllUsers = (req, res, next) => {
    user_model_1.default.find()
        .select("-password")
        .exec()
        .then((users) => {
        return res.status(200).json({
            users,
            count: users.length,
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error,
        });
    });
};
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id.toString();
        const user = yield user_model_1.default.findById(id);
        res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const user = yield user_model_1.default.find({
            username: username,
        });
        res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, image, email, username, password, bio } = req.body;
        const duplicateUsername = yield user_model_1.default.findOne({
            username: username,
            _id: { $nin: _id },
        });
        const duplicateEmail = yield user_model_1.default.findOne({
            email: email,
            _id: { $nin: _id },
        });
        if (password !== "" && !duplicateUsername && !duplicateEmail) {
            const userUpdated = yield user_model_1.default.findByIdAndUpdate(req.params.id, {
                image,
                email,
                username,
                bio,
                password,
            });
            res.status(200).json({
                message: "Updated successfully!",
                userUpdated,
            });
        }
        else if (password === "" && !duplicateUsername && !duplicateEmail) {
            const userUpdated = yield user_model_1.default.findByIdAndUpdate(req.params.id, {
                image,
                email,
                username,
                bio,
            });
            res.status(200).json({
                message: "Updated successfully!",
                userUpdated,
            });
        }
        else if (duplicateUsername) {
            res.status(403).json({
                message: "Username has been taken!",
            });
        }
        else if (duplicateEmail) {
            res.status(403).json({
                message: "Email has been taken!",
            });
        }
    }
    catch (error) { }
});
const addFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body;
        const usernameToFollow = req.params.username;
        const duplicateUsername = yield user_model_1.default.findOne({
            following: usernameToFollow,
        });
        if (!duplicateUsername) {
            yield user_model_1.default.updateOne({
                username: username,
            }, {
                $push: {
                    following: usernameToFollow,
                },
            });
            res.status(200).json({
                message: "Followed",
                username: usernameToFollow,
            });
        }
        else
            res.status(403).json({
                message: "You have followed this user",
                username: usernameToFollow,
            });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const unFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body;
        const userIdToUnfollow = req.params.id;
        yield user_model_1.default.updateOne({
            username: username,
        }, {
            $pull: {
                following: userIdToUnfollow,
            },
        });
        res.status(200).json({
            message: "Unfollowed",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    updateUser,
    addFollowing,
    unFollow,
    getUserByUsername,
};
