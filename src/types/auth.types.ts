export type Role = "admin" | "student";

export interface JwtPayload {
  sub: string; // id de l'utilisateur
  role: Role;
}
