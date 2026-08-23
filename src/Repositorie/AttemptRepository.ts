import { pool } from "../config/database";
import { Attempt } from "../Model/Attempt";

export const AttemptRepository = {
  async findByStudentAndExam(studentId: string, examId: string): Promise<Attempt | null> {
    const result = await pool.query<Attempt>(
      "SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2",
      [studentId, examId]
    );
    return result.rows[0] ?? null;
  },

  async findById(id: string): Promise<Attempt | null> {
    const result = await pool.query<Attempt>("SELECT * FROM attempts WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async findByExamId(examId: string): Promise<Attempt[]> {
    const result = await pool.query<Attempt>(
      "SELECT * FROM attempts WHERE exam_id = $1 ORDER BY started_at ASC",
      [examId]
    );
    return result.rows;
  },

  async findExamIdsByStudent(studentId: string): Promise<string[]> {
    const result = await pool.query<{ exam_id: string }>(
      "SELECT exam_id FROM attempts WHERE student_id = $1",
      [studentId]
    );
    return result.rows.map((r) => r.exam_id);
  },

  async findByStudentId(studentId: string): Promise<Attempt[]> {
    const result = await pool.query<Attempt>(
      "SELECT * FROM attempts WHERE student_id = $1 ORDER BY started_at DESC",
      [studentId]
    );
    return result.rows;
  },

  async create(studentId: string, examId: string): Promise<Attempt> {
    const result = await pool.query<Attempt>(
      `INSERT INTO attempts (student_id, exam_id) VALUES ($1, $2) RETURNING *`,
      [studentId, examId]
    );
    return result.rows[0];
  },

  async markSubmitted(id: string, score: number): Promise<Attempt> {
    const result = await pool.query<Attempt>(
      `UPDATE attempts SET submitted_at = now(), score = $2 WHERE id = $1 RETURNING *`,
      [id, score]
    );
    return result.rows[0];
  },
};
