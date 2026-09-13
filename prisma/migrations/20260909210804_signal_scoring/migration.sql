-- DropIndex
DROP INDEX "Session_cookieId_key";

-- AlterTable
ALTER TABLE "Classification" ADD COLUMN     "groupSize" INTEGER;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "signature" TEXT;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "analysisCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "suppressed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cookieId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SessionSignature" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionSignature_sessionId_idx" ON "SessionSignature"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSignature_sessionId_signature_key" ON "SessionSignature"("sessionId", "signature");

-- CreateIndex
CREATE INDEX "Event_sessionId_analyzedAt_idx" ON "Event"("sessionId", "analyzedAt");

-- CreateIndex
CREATE INDEX "Event_sessionId_signature_idx" ON "Event"("sessionId", "signature");

-- CreateIndex
CREATE INDEX "Session_suppressed_lastSeen_idx" ON "Session"("suppressed", "lastSeen");

-- CreateIndex
CREATE INDEX "Session_pendingScore_idx" ON "Session"("pendingScore");

-- AddForeignKey
ALTER TABLE "SessionSignature" ADD CONSTRAINT "SessionSignature_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
