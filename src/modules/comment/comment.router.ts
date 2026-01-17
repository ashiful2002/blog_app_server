import express, { Router } from "express";
import { commentController } from "./comment.controller";

const router = express.Router();

router.get("/", commentController.getAllComments);
export const commentRouter: Router = router;
