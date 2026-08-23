import { JwtPayload } from "./auth.types";

// Augmente le type Request d'Express pour exposer req.user une fois
// authMiddleware passé (typage/autocomplétion dans tous les controllers).
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
