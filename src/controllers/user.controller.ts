import { NextFunction, Response, Request } from "express";
import User from "../models/user.model";

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
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default { getAllUsers, getUserById };
