/*
  Warnings:

  - Made the column `userId` on table `books` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "pageNumbers" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("author", "date", "id", "isPublic", "pageNumbers", "title", "userId") SELECT "author", "date", "id", "isPublic", "pageNumbers", "title", "userId" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_userId_title_key" ON "books"("userId", "title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
