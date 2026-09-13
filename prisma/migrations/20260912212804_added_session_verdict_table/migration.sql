-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "sessionVerdictId" TEXT;

-- CreateTable
CREATE TABLE "SessionVerdict" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primaryAttackType" TEXT,
    "threatLevel" TEXT,
    "summary" TEXT,
    "detector" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "triggerReason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OK',
    "eventsSent" INTEGER NOT NULL,
    "eventsClassified" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3),
    "windowEnd" TIMESTAMP(3),

    CONSTRAINT "SessionVerdict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionVerdict_sessionId_createdAt_idx" ON "SessionVerdict"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "SessionVerdict_primaryAttackType_idx" ON "SessionVerdict"("primaryAttackType");

-- CreateIndex
CREATE INDEX "Event_sessionVerdictId_idx" ON "Event"("sessionVerdictId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sessionVerdictId_fkey" FOREIGN KEY ("sessionVerdictId") REFERENCES "SessionVerdict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionVerdict" ADD CONSTRAINT "SessionVerdict_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
