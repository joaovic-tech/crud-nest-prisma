/*
  Warnings:

  - A unique constraint covering the columns `[userId,title]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "books_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "books_userId_title_key" ON "books"("userId", "title");
