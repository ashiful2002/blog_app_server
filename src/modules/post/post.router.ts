import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

/**
 * 📌 Collection routes
 */
router.get("/", PostController.getAllPosts);
router.get(
  "/my-posts",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.getMyPosts
);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);
/**
 * 📌 Single post routes
 */

router.get("/:id", PostController.getSinglePost);
router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.deletePost
);

export const postRouter: Router = router;
