import e, { Request, Response } from "express";
import { commentServices } from "./comment.service";

const getAllComments = async (req: Request, res: Response) => {
  try {
    const allComments = await commentServices.getAllComments();
    res.status(200).json(allComments);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to get all comments",
      details: error.message,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const comment = await commentServices.getCommentById(id as string);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to get comment",
      details: error.message,
    });
  }
};
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const comment = await commentServices.getCommentByAuthor(
      authorId as string
    );
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to get comment",
      details: error.message,
    });
  }
};
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const postComment = await commentServices.createComment(req.body);
    res.status(201).json(postComment);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to create comment",
      details: error.message,
    });
  }
};
const deledeComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentServices.deledeComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to create comment",
      details: error.message,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentServices.updateComment(
      commentId as string,
      user?.id as string,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to create comment",
      details: error.message,
    });
  }
};
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "comment update failed";
    res.status(400).json({
      error: errorMessage,
      // details: error.message,
    });
  }
};

export const commentController = {
  getAllComments,
  getCommentById,
  createComment,
  getCommentByAuthor,
  deledeComment,
  updateComment,
  moderateComment,
};
