import { Pool } from "pg";
import { env } from "./env";

// Pool partagé par toute l'application. Chaque Repository l'importe et
// l'utilise avec des requêtes paramétrées ($1, $2, ...) — jamais de
// concaténation de chaînes dans une requête SQL.
export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

pool.on("error", (err) => {
  // Une erreur sur une connexion inactive du pool ne doit pas planter
  // le process, mais elle doit être visible dans les logs.
  console.error("Erreur inattendue sur une connexion PostgreSQL du pool:", err);
});

// Petit helper pour les écritures qui touchent plusieurs tables et
// doivent être atomiques (ex. question + ses choix, tentative + ses
// réponses). `fn` reçoit un client dédié à utiliser pour toutes les
// requêtes de la transaction.
export async function withTransaction<T>(
  fn: (client: import("pg").PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
