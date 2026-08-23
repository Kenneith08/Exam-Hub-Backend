import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";


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


  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erreur interne du serveur." });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} introuvable.` });
}
