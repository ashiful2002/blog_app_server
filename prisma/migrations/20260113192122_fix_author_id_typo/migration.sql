/*
  Warnings:

  - You are about to drop the column `authotId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- Rename column instead of drop + add (safe)
ALTER TABLE "posts"
RENAME COLUMN "authotId" TO "authorId";

-- Rename index (optional but clean)
ALTER INDEX "posts_authotId_idx"
RENAME TO "posts_authorId_idx";
