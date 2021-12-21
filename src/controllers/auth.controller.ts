import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import mongoose from "mongoose";
import user from "../models/user.model";
import signJWT from "../functions/signJWT";
import refreshToken from "../functions/refreshToken";
import jwt from "jsonwebtoken";
import config from "../config/config";

let refreshTokens: string[] = [];

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
    const duplicatUserNameAccount = await User.find({ username });
    const duplicatEmailAccount = await User.find({ email });
    if (duplicatEmailAccount.length < 1 || duplicatUserNameAccount.length < 1) {
      const salt = await bcrypt.genSalt(10);
      const hased = await bcrypt.hash(password, salt);

      // INSERT USER TO DB
      const newUser = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        username,
        email,
        password: hased,
      });
      return newUser.save().then((user) => {
        return res.status(200).json(user);
      });
    } else {
      return res.status(403).json({
        message: "User has been taken",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      const validAccount = await bcrypt.compare(password, user.password);
      if (validAccount) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      } else {
        signJWT(user, async (_error, token) => {
          if (_error) {
            return res.status(403).json({
              message: _error.message,
              error: _error,
            });
          } else if (token) {
            const newRefreshToken = refreshToken(user);
            refreshTokens.push(newRefreshToken);
            return res.status(200).json({
              message: "Auth successful",
              token: token,
              refreshToken: newRefreshToken,
              user: user,
            });
          }
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const refreshTokenControl = async (req: Request, res: Response) => {
  let refreshToken = req.body.refreshToken;
  console.log("refresh", refreshTokens);
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      message: "AccessToken expired",
    });
  } else {
    jwt.verify(
      refreshToken,
      config.server.token.refreshSecret,
      (error: any, decoded: any) => {
        if (error) {
          return res.status(403).json({
            message: error.message,
            error,
          });
        } else {
          jwt.verify(
            refreshToken,
            config.server.token.refreshSecret,
            (err: any, data: any) => {
              if (err) {
                res.status(403);
              } else {
                const accessToken = signJWT(data, (error, token) => {
                  if (error) {
                    res.status(403);
                  } else {
                    res.status(200).json({
                      accessToken: token,
                    });
                  }
                });
              }
            }
          );
        }
      }
    );
  }
};

const logout = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshtoken;

  refreshTokens = refreshTokens.filter((el) => el !== refreshToken);
  console.log("logout", refreshToken);

  res.status(200).json({
    message: "Logged out",
  });
};

export default { validateToken, register, login, logout, refreshTokenControl };
