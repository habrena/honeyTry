/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionKey` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "identMethod" TEXT NOT NULL DEFAULT 'cookie',
ADD COLUMN     "sessionKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionKey_key" ON "Session"("sessionKey");
