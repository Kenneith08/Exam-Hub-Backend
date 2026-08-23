import { NextFunction, Request, Response } from "express";

// Express ne catch pas automatiquement les rejets de promesses dans
// les handlers async. Ce wrapper évite d'écrire un try/catch dans
// chaque Controller : toute erreur (y compris une AppError) est
// transmise à next(), donc au middleware d'erreur central.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
