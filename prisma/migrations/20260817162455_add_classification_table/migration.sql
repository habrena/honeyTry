-- CreateTable
CREATE TABLE "Classification" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detector" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "severity" TEXT,
    "explanation" TEXT,

    CONSTRAINT "Classification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Classification_eventId_idx" ON "Classification"("eventId");

-- CreateIndex
CREATE INDEX "Classification_category_idx" ON "Classification"("category");

-- CreateIndex
CREATE INDEX "Classification_detector_idx" ON "Classification"("detector");

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
