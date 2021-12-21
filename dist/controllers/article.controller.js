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
const article_model_1 = __importDefault(require("../models/article.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllArticles = (req, res, next) => {
    article_model_1.default.find()
        .exec()
        .then((articles) => {
        return res.status(200).json({
            articles,
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error,
        });
    });
};
const createArticle = (req, res, next) => {
    try {
        const newArticle = new article_model_1.default(req.body);
        return newArticle.save().then((article) => {
            return res.status(200).json(article);
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
};
const updateArticle = (req, res, next) => {
    const articleId = req.params.id;
    const { title, desc, body, tagList } = req.body;
    // Articles.findById(articleId)
    //   .exec()
    //   .then((article) => {
    //     return res.status(200).json({
    //       article,
    //     });
    //   });
    article_model_1.default.findByIdAndUpdate(articleId, {
        title,
        desc,
        body,
        tagList: [tagList],
    }, (error, docs) => {
        if (error) {
            res.status(500).json({
                message: error.message,
                error,
            });
        }
        else {
            article_model_1.default.findById(articleId).then((article) => {
                return res.status(200).json(article);
            });
        }
    });
};
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        yield article_model_1.default.findByIdAndDelete(articleId);
        res.status(200).json({
            mesage: "Delete successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const getArticleById = (req, res, next) => {
    const articleId = req.params.id;
    article_model_1.default.findById(articleId)
        .exec()
        .then((article) => {
        return res.status(200).json({
            article,
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error,
        });
    });
};
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const { body, author, createdAt } = req.body;
        const { username, bio, image } = author;
        yield article_model_1.default.findById(articleId).updateOne({ id: articleId }, {
            $push: {
                comments: {
                    commentId: new mongoose_1.default.Types.ObjectId().toString(),
                    body,
                    author: {
                        username,
                        bio,
                        image,
                    },
                    createdAt,
                },
            },
        });
        return res.status(200).json({
            message: "Post successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const commentId = req.params.commentId;
        yield article_model_1.default.findOneAndUpdate({ id: articleId }, { $pull: { comments: { commentId: commentId.toString() } } });
        res.status(200).json({
            message: "Delete comment successfully!",
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            err,
        });
    }
});
const toggleFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const { id } = req.body;
        const favoritedUsers = yield article_model_1.default.findOne({
            id: articleId,
        });
        if (favoritedUsers) {
            const favoritesCount = favoritedUsers.favoritesCount;
            if (!(favoritedUsers === null || favoritedUsers === void 0 ? void 0 : favoritedUsers.favorited.includes(id))) {
                yield article_model_1.default.updateOne({ id: articleId }, {
                    $push: {
                        favorited: id,
                    },
                    favoritesCount: favoritesCount + 1,
                });
                res.status(200).json({
                    message: "Favorited",
                });
            }
            else {
                yield article_model_1.default.updateOne({ id: articleId }, {
                    $pull: {
                        favorited: id,
                    },
                    favoritesCount: favoritesCount - 1,
                });
                res.status(200).json({
                    message: "Unfavorited",
                });
            }
        }
        res.status(404);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
});
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const userId = req.body.id;
        yield article_model_1.default.updateOne({ id: articleId }, {
            $pull: {
                favorited: userId,
            },
        });
        res.status(200).json({
            userId,
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
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    createComment,
    deleteComment,
    toggleFavorite,
};
