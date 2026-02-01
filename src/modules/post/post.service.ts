import {
  CommentStatus,
  PosStatus,
  Post,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

// get all posts
const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  tags?: string[] | [];
  isFeatured: boolean | undefined;
  status: PosStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];

  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if (tags?.length) {
    andCondition.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }

  if (status) {
    andCondition.push({ status });
  }
  if (authorId) {
    andCondition.push({
      authorId,
    });
  }
  const allPosts = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });
  return {
    total: allPosts.length,
    ok: true,
    data: allPosts,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

// get single post
const getSinglePost = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: { id },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return result;
  });
};

// create new post
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};
const getMyPosts = async (authorId: string) => {
  const total = await prisma.post.count({
    where: { authorId },
  });
  // const total = await prisma.post.aggregate({
  //   _count: {
  //     id: true,
  //   },
  //   where: {
  //     authorId,
  //   },
  // });

  await prisma.user.findFirstOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return { total: total, data: result };
};

// update user
const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner or creator of this post");
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }
  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });

  return { statut: "UPDATED SUCCESSFULLY", data: result };
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner or creator of this post");
  }
  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      totalUsers,
      adminCounts,
      userCounts,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PosStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PosStatus.DRAFT } }),
      await tx.post.count({ where: { status: PosStatus.DRAFT } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
      await tx.user.count(),
      await tx.user.count({ where: { role: UserRole.ADMIN } }),
      await tx.user.count({ where: { role: UserRole.USER } }),
      await tx.post.aggregate({ _sum: { views: true } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      totalUsers,
      adminCounts,
      userCounts,
      totalViews: totalViews._sum.views,
    };
  });
};
export const postService = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
