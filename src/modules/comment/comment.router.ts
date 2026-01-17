import express, { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", commentController.getAllComments);
router.get("/:id", commentController.getCommentById);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);

export const commentRouter: Router = router;
