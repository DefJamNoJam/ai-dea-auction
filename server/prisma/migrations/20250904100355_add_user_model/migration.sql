/*
  Warnings:

  - You are about to drop the column `owner` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Idea` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "owner",
DROP COLUMN "ownerName",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Idea" DROP COLUMN "owner",
DROP COLUMN "ownerName",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Idea" ADD CONSTRAINT "Idea_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
