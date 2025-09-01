import "dotenv/config";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { ResponseHandler } from "./ResponseHandler";

export const validJWToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
    return ResponseHandler.success(decoded, "Token is valid");

  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return ResponseHandler.error("Token has expired");
    }
    if (err instanceof JsonWebTokenError) {
      return ResponseHandler.error("Invalid token");
    }
    return ResponseHandler.error("Token verification failed", err);
  }
};
