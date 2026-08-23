import { Router } from "express";
import { StudentController } from "../Controller/StudentController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", asyncHandler(StudentController.list));
router.post("/", asyncHandler(StudentController.create));
router.put("/:id", asyncHandler(StudentController.update));
router.delete("/:id", asyncHandler(StudentController.deactivate)); // = désactivation, RG-10

export default router;
