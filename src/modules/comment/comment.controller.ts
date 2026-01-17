import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { commentServices } from "./comment.service";

const getAllComments = async (req: Request, res: Response) => {
  try {
    const allComments = await commentServices.getAllComments();
    return allComments;
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to get all comments",
      details: error.message,
    });
  }
};

export const commentController = { getAllComments };
