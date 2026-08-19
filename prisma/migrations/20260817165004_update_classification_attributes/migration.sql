/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Classification_eventId_key" ON "Classification"("eventId");
