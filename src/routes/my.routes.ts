import { Router } from "express";
import { MyExamController } from "../Controller/MyExamController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("student"));

router.get("/exams", asyncHandler(MyExamController.listAvailable));
router.get("/exams/:id", asyncHandler(MyExamController.getOne));
router.post("/exams/:id/submit", asyncHandler(MyExamController.submit));
router.get("/results", asyncHandler(MyExamController.history));

export default router;
