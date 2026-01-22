import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllComments = async () => {
  const result = await prisma.comment.findMany();
  return result;
};

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return result;
};
const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  console.log(authorId);
};
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({ data: payload });
};

const deledeComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your Provided input is invalid");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  authorId: string,
  data: {
    content?: string;
    status?: CommentStatus;
  }
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("comment Not found ");
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const existsComent = await prisma.comment.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });
  if (existsComent.status === data.status) {
    throw new Error(`your provided status (${data.status}) is alread exists`);
  }
  return await prisma.comment.update({
    where: { id },
    data,
  });
};


export const commentServices = {
  getAllComments,
  getCommentByAuthor,
  getCommentById,
  deledeComment,
  createComment,
  updateComment,
  moderateComment,
};
