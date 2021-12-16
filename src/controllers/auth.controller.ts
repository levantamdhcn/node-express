import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import mongoose from "mongoose";
import user from "../models/user.model";
import signJWT from "../functions/signJWT";

const NAMESPACE = "user";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Token validated, user authorized");

  return res.status(200).json({
    message: "Authorized",
  });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hased = await bcrypt.hash(password, salt);

    // INSERT USER TO DB
    const newUser = new User({
      id: new mongoose.Types.ObjectId(),
      username,
      email,
      password: hased,
    });
    return newUser.save().then((user) => {
      return res.status(200).json(user);
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body;

  User.find({ username })
    .exec()
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      bcrypt.compare(password, users[0].password, (_error, result) => {
        if (_error) {
          logging.error(NAMESPACE, "Unable to sign token: ", _error);

          return res.status(401).json({
            message: "Unauthorized",
            erorr: _error,
          });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error) {
              return res.status(500).json({
                message: _error.message,
                error: _error,
              });
            } else if (token) {
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

export default { validateToken, register, login };
