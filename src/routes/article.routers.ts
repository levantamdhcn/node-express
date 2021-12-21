import express from "express";
import articleController from "../controllers/article.controller";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/get/all", articleController.getAllArticles);
router.post("/", articleController.createArticle);
router.put("/:id", articleController.updateArticle);
router.get("/get/:id", articleController.getArticleById);
router.delete("/:id", articleController.deleteArticle);
router.post("/:id/comment", articleController.createComment);
router.delete("/:id/comment/:commentId", articleController.deleteComment);
router.put("/:id/favorite", articleController.toggleFavorite);

export default router;
