import express from "express";
import cors from "cors";
import apiRouter from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
