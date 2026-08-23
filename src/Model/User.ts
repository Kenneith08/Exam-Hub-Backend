import { Role } from "../types/auth.types";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type PublicUser = Omit<User, "password_hash">;

export function toPublicUser(user: User): PublicUser {
  const { password_hash, ...publicUser } = user;
  return publicUser;
}
