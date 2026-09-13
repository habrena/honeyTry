/*
  Warnings:

  - You are about to drop the column `groupSize` on the `Classification` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `pendingScore` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `SessionSignature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionSignature" DROP CONSTRAINT "SessionSignature_sessionId_fkey";

-- DropIndex
DROP INDEX "Event_sessionId_signature_idx";

-- DropIndex
DROP INDEX "Session_pendingScore_idx";

-- DropIndex
DROP INDEX "Session_suppressed_lastSeen_idx";

-- AlterTable
ALTER TABLE "Classification" DROP COLUMN "groupSize";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "score",
DROP COLUMN "signature",
ADD COLUMN     "detectionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "pendingScore",
ALTER COLUMN "lastSeen" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "SessionSignature";

-- CreateIndex
CREATE INDEX "Session_lastSeen_idx" ON "Session"("lastSeen");
