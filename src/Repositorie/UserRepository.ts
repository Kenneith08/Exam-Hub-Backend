import { pool } from "../config/database";
import { User } from "../Model/User";
import { Role } from "../types/auth.types";

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] ?? null;
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async findAllByRole(role: Role): Promise<User[]> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC",
      [role]
    );
    return result.rows;
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
  }): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.email, data.passwordHash, data.role]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<{ name: string; email: string; passwordHash: string; isActive: boolean }>
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${i++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${i++}`);
      values.push(data.email);
    }
    if (data.passwordHash !== undefined) {
      fields.push(`password_hash = $${i++}`);
      values.push(data.passwordHash);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${i++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<User>(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  },
};
