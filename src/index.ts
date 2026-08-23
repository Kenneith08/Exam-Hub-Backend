import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`Exam Hub API démarrée sur http://localhost:${env.port}`);
});
