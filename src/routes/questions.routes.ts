import { Router } from "express";
import { QuestionController } from "../Controller/QuestionController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.put("/:id", asyncHandler(QuestionController.update));
router.delete("/:id", asyncHandler(QuestionController.remove));

export default router;
