import jwt from "jsonwebtoken";
import config from "../config/config";
import logging from "../config/logging";
import UserState from "../interfaces/user";

const NAMESPACE = "Auth";

const signJWT = (
  user: UserState,
  callback: (error: Error | null, token: string | null) => void
): void => {
  var timeSinchEpoch = new Date().getTime();
  var expirationTime =
    timeSinchEpoch + Number(config.server.token.expireTime) * 100000;
  var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  logging.info(NAMESPACE, `Attemping to sign token for ${user.username}`);

  try {
    jwt.sign(
      { username: user.username },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error: any) {
    logging.error(NAMESPACE, error.message, error);
    callback(error, null);
  }
};

export default signJWT;
