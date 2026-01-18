import express, { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", commentController.getAllComments);
router.get("/author/:authorId", commentController.getCommentByAuthor);

router.get("/:id", commentController.getCommentById);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.deledeComment
);
router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.updateComment
);
export const commentRouter: Router = router;
