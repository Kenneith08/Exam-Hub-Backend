import { Router } from "express";
import { CourseController } from "../Controller/CourseController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", asyncHandler(CourseController.list));
router.post("/", asyncHandler(CourseController.create));
router.put("/:id", asyncHandler(CourseController.update));
router.delete("/:id", asyncHandler(CourseController.remove));

export default router;
