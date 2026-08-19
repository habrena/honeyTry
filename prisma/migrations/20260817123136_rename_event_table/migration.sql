/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_sessionId_fkey";

-- DropTable
DROP TABLE "Log";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "statusCode" INTEGER,
    "durationMs" INTEGER,
    "queryParams" JSONB,
    "body" JSONB,
    "headers" JSONB,
    "contentType" TEXT,
    "referer" TEXT,
    "origin" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_sessionId_idx" ON "Event"("sessionId");

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- CreateIndex
CREATE INDEX "Event_timestamp_idx" ON "Event"("timestamp");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
