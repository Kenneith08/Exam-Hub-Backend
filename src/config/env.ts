import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),

  db: {
    host: required("DB_HOST", "localhost"),
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    user: required("DB_USER", "exam_hub_user"),
    password: required("DB_PASSWORD", "change_me"),
    database: required("DB_NAME", "exam_hub"),
  },

  jwt: {
    secret: required("JWT_SECRET", "change_me"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },

  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),

  seed: {
    adminName: process.env.SEED_ADMIN_NAME ?? "Administrateur",
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@exam-hub.test",
    adminPassword: process.env.SEED_ADMIN_PASSWORD ?? "Admin123!",
  },
};
