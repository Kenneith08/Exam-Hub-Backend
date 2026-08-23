import { pool } from "../../src/config/database";
import { env } from "../../src/config/env";
import { hashPassword } from "../../src/Security/hash";
//Ici y'a pas vraiment besoin de checker tout baigne sauf que vous devez modifier le .env vu comme dans 
// Le modèle .env.example 
// Ps: oubliez pas de me rappeler de refactor ici vers la fin du delai accordé c'est pas presentable au prof ces coms 

async function main() {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    env.seed.adminEmail,
  ]);

  if ((existing.rowCount ?? 0) > 0) {
    console.log(`Un administrateur existe déjà pour ${env.seed.adminEmail}, rien à faire.`);
    await pool.end();
    return;
  }

  const passwordHash = await hashPassword(env.seed.adminPassword);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, 'admin', TRUE)`,
    [env.seed.adminName, env.seed.adminEmail, passwordHash]
  );

  console.log("Administrateur initial créé :");
  console.log(`  email    : ${env.seed.adminEmail}`);
  console.log(`  password : ${env.seed.adminPassword}`);

  await pool.end();
}

main().catch((err) => {
  console.error("Échec du seed admin :", err);
  process.exit(1);
});
