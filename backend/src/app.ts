import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { quizzesRouter } from "./routes/quizzes.js";

export const app = express();

app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/quizzes", quizzesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
