import { prisma } from "../../lib/prisma";

const getAllComments = async () => {
  const result = await prisma.comment.findMany();
  return result;
};

const createComment = async (data) => {
  const result = await prisma.comment.create({
    data: {
      ...data,
    },
  });
};
export const commentServices = {
  getAllComments,
};
