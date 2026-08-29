import fs from "fs";
import path from "path";
import { pool } from "../../src/config/database";
import { seedAdmin } from "./001_seed_admin";

async function runSqlFile(filePath: string): Promise<void> {
  const sql = fs.readFileSync(filePath, "utf8");
  await pool.query(sql);
  console.log(`Exécuté : ${path.basename(filePath)}`);
}

async function main() {
  await seedAdmin();
  await runSqlFile(path.join(__dirname, "002_seed_test_students.sql"));
  await runSqlFile(path.join(__dirname, "003_seed_test_content.sql"));
  console.log("\nDonnées de test prêtes (admin + 5 étudiants + cours/examens/résultats).");
}

main()
  .catch((err) => {
    console.error("Échec du seed de démo :", err);
    process.exit(1);
  })
  .finally(() => pool.end());
