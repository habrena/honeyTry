-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "analyzeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "analyzedAt" TIMESTAMP(3);
