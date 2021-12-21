import UserState from "../interfaces/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

const refreshToken = (user: UserState) => {
  return jwt.sign(
    { username: user.username },
    config.server.token.refreshSecret
  );
};

export default refreshToken;
