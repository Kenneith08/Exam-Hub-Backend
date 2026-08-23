import { Router } from "express";
import { AuthController } from "../Controller/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.post("/login", asyncHandler(AuthController.login));

export default router;
