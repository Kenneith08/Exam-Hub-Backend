import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../middlewares/errors";
import { verifyToken } from "./jwt";

// Vérifie l'en-tête `Authorization: Bearer <token>`, décode le JWT
// et attache { sub, role } à req.user pour les middlewares/controllers
// suivants. À monter sur toute route protégée.
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token d'authentification manquant.");
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new UnauthorizedError("Token d'authentification invalide ou expiré.");
  }
}
