export type Role = "admin" | "student";

export interface JwtPayload {
  sub: string; 
  role: Role;
}
