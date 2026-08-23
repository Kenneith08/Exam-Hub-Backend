import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Answer } from "../Model/Answer";

export const AnswerRepository = {
  async findByAttemptId(attemptId: string): Promise<Answer[]> {
    const result = await pool.query<Answer>("SELECT * FROM answers WHERE attempt_id = $1", [
      attemptId,
    ]);
    return result.rows;
  },

  async create(
    data: { attemptId: string; questionId: string; choiceId: string | null },
    client: PoolClient | typeof pool = pool
  ): Promise<Answer> {
    const result = await client.query<Answer>(
      `INSERT INTO answers (attempt_id, question_id, choice_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.attemptId, data.questionId, data.choiceId]
    );
    return result.rows[0];
  },
};
