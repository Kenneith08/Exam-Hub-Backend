import { Router } from "express";
import { ExamController } from "../Controller/ExamController";
import { QuestionController } from "../Controller/QuestionController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", asyncHandler(ExamController.list));
router.post("/", asyncHandler(ExamController.create));
router.get("/:id", asyncHandler(ExamController.getOne));
router.put("/:id", asyncHandler(ExamController.update));
router.delete("/:id", asyncHandler(ExamController.remove));

router.get("/:id/questions", asyncHandler(QuestionController.listByExam));
router.post("/:id/questions", asyncHandler(QuestionController.create));

router.get("/:id/results", asyncHandler(ExamController.results));

export default router;
