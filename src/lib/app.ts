import express, { Application } from "express";
import { postRouter } from "../modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";
import { commentRouter } from "../modules/comment/comment.router";
const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});
export default app;
