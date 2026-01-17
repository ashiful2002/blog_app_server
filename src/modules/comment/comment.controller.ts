import { Request, Response } from "express";
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

export const commentController = {
  getAllComments,
  getCommentById,
  createComment,
};
