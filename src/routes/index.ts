import { Router } from "express";
import authRoutes from "./auth.routes";
import studentsRoutes from "./students.routes";
import coursesRoutes from "./courses.routes";
import examsRoutes from "./exams.routes";
import questionsRoutes from "./questions.routes";
import myRoutes from "./my.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/students", studentsRoutes);
router.use("/courses", coursesRoutes);
router.use("/exams", examsRoutes);
router.use("/questions", questionsRoutes);
router.use("/my", myRoutes);

export default router;
