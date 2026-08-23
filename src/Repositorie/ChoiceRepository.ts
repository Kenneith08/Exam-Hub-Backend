import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Choice } from "../Model/Choice";

export const ChoiceRepository = {
  async findByQuestionId(questionId: string): Promise<Choice[]> {
    const result = await pool.query<Choice>(
      "SELECT * FROM choices WHERE question_id = $1 ORDER BY position ASC",
      [questionId]
    );
    return result.rows;
  },

  async findByQuestionIds(questionIds: string[]): Promise<Choice[]> {
    if (questionIds.length === 0) return [];
    const result = await pool.query<Choice>(
      "SELECT * FROM choices WHERE question_id = ANY($1::uuid[]) ORDER BY position ASC",
      [questionIds]
    );
    return result.rows;
  },

  async findById(id: string): Promise<Choice | null> {
    const result = await pool.query<Choice>("SELECT * FROM choices WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async create(
    data: { questionId: string; label: string; isCorrect: boolean; position: number },
    client: PoolClient | typeof pool = pool
  ): Promise<Choice> {
    const result = await client.query<Choice>(
      `INSERT INTO choices (question_id, label, is_correct, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.questionId, data.label, data.isCorrect, data.position]
    );
    return result.rows[0];
  },


  async deleteByQuestionId(questionId: string, client: PoolClient | typeof pool = pool): Promise<void> {
    await client.query("DELETE FROM choices WHERE question_id = $1", [questionId]);
  },
};
