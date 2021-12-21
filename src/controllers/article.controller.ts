import { Request, Response, NextFunction } from "express";
import ArticleModel from "../models/article.model";
import mongoose from "mongoose";

const getAllArticles = (req: Request, res: Response, next: NextFunction) => {
  ArticleModel.find()
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

const createArticle = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newArticle = new ArticleModel(req.body);
    return newArticle.save().then((article) => {
      return res.status(200).json(article);
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.id;
  const { title, desc, body, tagList } = req.body;
  // Articles.findById(articleId)
  //   .exec()
  //   .then((article) => {
  //     return res.status(200).json({
  //       article,
  //     });
  //   });
  ArticleModel.findByIdAndUpdate(
    articleId,
    {
      title,
      desc,
      body,
      tagList: [tagList],
    },
    (error, docs) => {
      if (error) {
        res.status(500).json({
          message: error.message,
          error,
        });
      } else {
        ArticleModel.findById(articleId).then((article) => {
          return res.status(200).json(article);
        });
      }
    }
  );
};

const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.id;
    await ArticleModel.findByIdAndDelete(articleId);
    res.status(200).json({
      mesage: "Delete successfully!",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getArticleById = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.id;
  ArticleModel.findById(articleId)
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

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.id;
    const { body, author, createdAt } = req.body;
    const { username, bio, image } = author;
    await ArticleModel.findById(articleId).updateOne(
      { id: articleId },
      {
        $push: {
          comments: {
            commentId: new mongoose.Types.ObjectId().toString(),
            body,
            author: {
              username,
              bio,
              image,
            },
            createdAt,
          },
        },
      }
    );
    return res.status(200).json({
      message: "Post successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const commentId = req.params.commentId;
    await ArticleModel.findOneAndUpdate(
      { id: articleId },
      { $pull: { comments: { commentId: commentId.toString() } } }
    );
    res.status(200).json({
      message: "Delete comment successfully!",
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
      err,
    });
  }
};

const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const { id } = req.body;
    const favoritedUsers = await ArticleModel.findOne({
      id: articleId,
    });
    if (favoritedUsers) {
      const favoritesCount = favoritedUsers.favoritesCount;
      if (!favoritedUsers?.favorited.includes(id)) {
        await ArticleModel.updateOne(
          { id: articleId },
          {
            $push: {
              favorited: id,
            },
            favoritesCount: favoritesCount + 1,
          }
        );
        res.status(200).json({
          message: "Favorited",
        });
      } else {
        await ArticleModel.updateOne(
          { id: articleId },
          {
            $pull: {
              favorited: id,
            },
            favoritesCount: favoritesCount - 1,
          }
        );
        res.status(200).json({
          message: "Unfavorited",
        });
      }
    }
    res.status(404);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const removeFavorite = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const userId = req.body.id;
    await ArticleModel.updateOne(
      { id: articleId },
      {
        $pull: {
          favorited: userId,
        },
      }
    );
    res.status(200).json({
      userId,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  createComment,
  deleteComment,
  toggleFavorite,
};
