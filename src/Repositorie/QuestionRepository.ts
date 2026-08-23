import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Question } from "../Model/Question";

export const QuestionRepository = {
  async findByExamId(examId: string): Promise<Question[]> {
    const result = await pool.query<Question>(
      "SELECT * FROM questions WHERE exam_id = $1 ORDER BY position ASC, created_at ASC",
      [examId]
    );
    return result.rows;
  },

  async findById(id: string): Promise<Question | null> {
    const result = await pool.query<Question>("SELECT * FROM questions WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async create(
    data: { examId: string; statement: string; points: number; position: number },
    client: PoolClient | typeof pool = pool
  ): Promise<Question> {
    const result = await client.query<Question>(
      `INSERT INTO questions (exam_id, statement, points, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.examId, data.statement, data.points, data.position]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<{ statement: string; points: number; position: number }>
  ): Promise<Question | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (data.statement !== undefined) {
      fields.push(`statement = $${i++}`);
      values.push(data.statement);
    }
    if (data.points !== undefined) {
      fields.push(`points = $${i++}`);
      values.push(data.points);
    }
    if (data.position !== undefined) {
      fields.push(`position = $${i++}`);
      values.push(data.position);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<Question>(
      `UPDATE questions SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM questions WHERE id = $1", [id]);
  },
};
