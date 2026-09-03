-- CreateTable
CREATE TABLE "Doktor" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "odjel" TEXT NOT NULL,
    "ukupno" INTEGER NOT NULL,
    "brojZakazanih" INTEGER NOT NULL,
    "brojSlobodnih" INTEGER NOT NULL,

    CONSTRAINT "Doktor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Uloga" (
    "id" SERIAL NOT NULL,
    "uloga" TEXT NOT NULL,
    "broj" INTEGER NOT NULL,

    CONSTRAINT "Uloga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Termin" (
    "id" SERIAL NOT NULL,
    "doktorId" INTEGER NOT NULL,
    "pacijentId" INTEGER,
    "datum" TEXT NOT NULL,
    "razlog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Termin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Uloga_uloga_key" ON "Uloga"("uloga");
