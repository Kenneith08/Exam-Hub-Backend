import { Request, Response } from "express";
import { AuthService } from "../Service/AuthService";
import { BadRequestError } from "../middlewares/errors";

export const AuthController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      throw new BadRequestError("Email et mot de passe sont requis.");
    }

    const { token, user } = await AuthService.login(email, password);
    res.status(200).json({ token, user });
  },
};
