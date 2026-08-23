import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth.types";

export function signToken(payload: JwtPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwt.secret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}
