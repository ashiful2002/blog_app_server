import express, { Application } from "express";
import { postRouter } from "../modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";
import { commentRouter } from "../modules/comment/comment.router";
import globalErrorHabdler from "../middlewares/globalErrorHandler";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    // origin: process.env.APP_URL,
    origin: 'http://localhost:3001', // Allow your frontend
    credentials: true,
  })
);

app.use((req, res, next) => {
  const startTime = process.hrtime();
  const startDate = new Date().toISOString();

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const execTimeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    console.log(
      `[${startDate}] ${req.method} ${req.originalUrl} - ${execTimeMs} ms`
    );
  });

  next();
});
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.get("/", (req, res) => {
  res.send("Prisma Blog server");
});

app.use(globalErrorHabdler);

export default app;
