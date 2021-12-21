"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
const router = express_1.default.Router();
router.get("/get/all", article_controller_1.default.getAllArticles);
router.post("/", article_controller_1.default.createArticle);
router.put("/:id", article_controller_1.default.updateArticle);
router.get("/get/:id", article_controller_1.default.getArticleById);
router.delete("/:id", article_controller_1.default.deleteArticle);
router.post("/:id/comment", article_controller_1.default.createComment);
router.delete("/:id/comment/:commentId", article_controller_1.default.deleteComment);
router.put("/:id/favorite", article_controller_1.default.toggleFavorite);
exports.default = router;
