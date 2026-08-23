import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";

// À monter EN DERNIER dans app.ts (après toutes les routes).
// Garantit le format RG-13 pour absolument toutes les erreurs,
// y compris celles non prévues (bug, driver pg qui jette, etc.)
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Erreur non anticipée : on ne fuite pas les détails internes au
  // client, mais on la logue pour le débogage.
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erreur interne du serveur." });
}

// À monter juste avant errorHandler : transforme toute route non
// trouvée en 404 au format RG-13 plutôt qu'en page HTML par défaut
// d'Express.
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} introuvable.` });
}
