import { pool } from "../config/database";
import { Exam } from "../Model/Exam";

export const ExamRepository = {
  async findAll(): Promise<Exam[]> {
    const result = await pool.query<Exam>("SELECT * FROM exams ORDER BY opens_at DESC");
    return result.rows;
  },

  async findById(id: string): Promise<Exam | null> {
    const result = await pool.query<Exam>("SELECT * FROM exams WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async findOpenExams(now: Date = new Date()): Promise<Exam[]> {
    const result = await pool.query<Exam>(
      `SELECT * FROM exams WHERE opens_at <= $1 AND closes_at >= $1 ORDER BY closes_at ASC`,
      [now]
    );
    return result.rows;
  },

  async create(data: {
    courseId: string;
    title: string;
    description?: string | null;
    opensAt: Date;
    closesAt: Date;
  }): Promise<Exam> {
    const result = await pool.query<Exam>(
      `INSERT INTO exams (course_id, title, description, opens_at, closes_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.courseId, data.title, data.description ?? null, data.opensAt, data.closesAt]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      opensAt: Date;
      closesAt: Date;
    }>
  ): Promise<Exam | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${i++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${i++}`);
      values.push(data.description);
    }
    if (data.opensAt !== undefined) {
      fields.push(`opens_at = $${i++}`);
      values.push(data.opensAt);
    }
    if (data.closesAt !== undefined) {
      fields.push(`closes_at = $${i++}`);
      values.push(data.closesAt);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<Exam>(
      `UPDATE exams SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  },

  async hasAttempts(id: string): Promise<boolean> {
    const result = await pool.query("SELECT 1 FROM attempts WHERE exam_id = $1 LIMIT 1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM exams WHERE id = $1", [id]);
  },
};
