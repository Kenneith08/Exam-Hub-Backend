import { Router } from "express";
import { QuestionController } from "../Controller/QuestionController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

// Les choix sont imbriqués dans la question : PUT remplace la
// question ET sa liste de choix en une seule fois.
router.put("/:id", asyncHandler(QuestionController.update));
router.delete("/:id", asyncHandler(QuestionController.remove));

export default router;
