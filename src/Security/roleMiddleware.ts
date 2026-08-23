import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../middlewares/errors";
import { Role } from "../types/auth.types";


export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentification requise.");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Vous n'avez pas les droits pour accéder à cette ressource.");
    }
    next();
  };
}
