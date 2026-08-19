/*
  Warnings:

  - A unique constraint covering the columns `[cookieId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cookieId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_tokenId_key";

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "body" JSONB,
ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "queryParams" JSONB,
ADD COLUMN     "referer" TEXT,
ADD COLUMN     "statusCode" INTEGER;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "cookieId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Log_sessionId_idx" ON "Log"("sessionId");

-- CreateIndex
CREATE INDEX "Log_eventType_idx" ON "Log"("eventType");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Session_cookieId_key" ON "Session"("cookieId");

-- CreateIndex
CREATE INDEX "Session_tokenId_idx" ON "Session"("tokenId");

-- CreateIndex
CREATE INDEX "Session_sourceIp_idx" ON "Session"("sourceIp");
