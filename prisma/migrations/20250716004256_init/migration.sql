-- CreateTable
CREATE TABLE "StockTerm" (
    "id" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockTerm_term_key" ON "StockTerm"("term");
