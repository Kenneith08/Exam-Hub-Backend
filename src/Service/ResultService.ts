import { pool } from "../config/database";
import { ExamRepository } from "../Repositorie/ExamRepository";
import { NotFoundError } from "../middlewares/errors";

interface StudentResultRow {
  student_id: string;
  student_name: string;
  student_email: string;
  score: number | null;
  submitted_at: Date | null;
  started_at: Date;
}

export interface ExamResults {
  examId: string;
  attemptsCount: number;
  average: number | null;
  students: {
    studentId: string;
    name: string;
    email: string;
    score: number | null;
    submittedAt: Date | null;
    startedAt: Date;
  }[];
}

export const ResultService = {
  async getExamResults(examId: string): Promise<ExamResults> {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new NotFoundError("Examen introuvable.");
    }

    const result = await pool.query<StudentResultRow>(
      `SELECT
         a.student_id,
         u.name AS student_name,
         u.email AS student_email,
         a.score,
         a.submitted_at,
         a.started_at
       FROM attempts a
       JOIN users u ON u.id = a.student_id
       WHERE a.exam_id = $1
       ORDER BY a.started_at ASC`,
      [examId]
    );

    const rows = result.rows;
    const scoredRows = rows.filter((r) => r.score !== null) as (StudentResultRow & { score: number })[];
    const average =
      scoredRows.length > 0
        ? scoredRows.reduce((sum, r) => sum + Number(r.score), 0) / scoredRows.length
        : null;

    return {
      examId,
      attemptsCount: rows.length,
      average,
      students: rows.map((r) => ({
        studentId: r.student_id,
        name: r.student_name,
        email: r.student_email,
        score: r.score !== null ? Number(r.score) : null,
        submittedAt: r.submitted_at,
        startedAt: r.started_at,
      })),
    };
  },
};
