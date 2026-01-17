import { Request, Response } from "express";
import { postService } from "./post.service";
import { PosStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchStr = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // both true or false
    // trickey
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;
    const status = req.query.status as PosStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    const options = paginationSortingHelper(req.query);
    const { page, limit, skip, sortBy, sortOrder } = options;

    const result = await postService.getAllPosts({
      search: searchStr,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to get all posts",
      details: error.message,
    });
  }
};

/// get single post
const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post id is required");
    }
    const result = await postService.getSinglePost(id as string);
    if (!result) {
      return res.status(404).json({
        message: "post not found",
      });
    }
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to fetch post",
      details: error.message,
    });
  }
};
// create post
const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorised",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: error.message,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
};
