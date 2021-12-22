import { NextFunction, Response, Request } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
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

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id.toString();
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await User.find({
      username: username,
    });
    res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id, image, email, username, password, bio } = req.body;
    const duplicateUsername = await User.findOne({
      username: username,
      _id: { $nin: _id },
    });
    const duplicateEmail = await User.findOne({
      email: email,
      _id: { $nin: _id },
    });
    if (password !== "" && !duplicateUsername && !duplicateEmail) {
      const userUpdated = await User.findByIdAndUpdate(req.params.id, {
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
    } else if (password === "" && !duplicateUsername && !duplicateEmail) {
      const userUpdated = await User.findByIdAndUpdate(req.params.id, {
        image,
        email,
        username,
        bio,
      });
      res.status(200).json({
        message: "Updated successfully!",
        userUpdated,
      });
    } else if (duplicateUsername) {
      res.status(403).json({
        message: "Username has been taken!",
      });
    } else if (duplicateEmail) {
      res.status(403).json({
        message: "Email has been taken!",
      });
    }
  } catch (error) {}
};

const addFollowing = async (req: Request, res: Response) => {
  try {
    const username = req.body;
    const usernameToFollow = req.params.username;
    const duplicateUsername = await User.findOne({
      following: usernameToFollow,
    });
    if (!duplicateUsername) {
      await User.updateOne(
        {
          username: username.toString(),
        },
        {
          $push: {
            following: usernameToFollow.toString(),
          },
        }
      );
      res.status(200).json({
        message: "Followed",
        username: usernameToFollow,
      });
    } else
      res.status(403).json({
        message: "You have followed this user",
        username: usernameToFollow,
      });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const unFollow = async (req: Request, res: Response) => {
  try {
    const username = req.body;
    const userIdToUnfollow = req.params.id;
    await User.updateOne(
      {
        username: username,
      },
      {
        $pull: {
          following: userIdToUnfollow,
        },
      }
    );
    res.status(200).json({
      message: "Unfollowed",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  addFollowing,
  unFollow,
  getUserByUsername,
};
