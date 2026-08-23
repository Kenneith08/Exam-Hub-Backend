import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../middlewares/errors";
import { Role } from "../types/auth.types";

// À monter APRÈS requireAuth. Vérifie que le rôle du token correspond
// à l'un des rôles autorisés pour la route (403 sinon).
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
