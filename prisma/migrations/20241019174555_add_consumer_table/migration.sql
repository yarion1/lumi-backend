/*
  Warnings:

  - Added the required column `consumerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distributor` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "consumerId" INTEGER NOT NULL,
ADD COLUMN     "distributor" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Consumer" (
    "id" SERIAL NOT NULL,
    "ucName" TEXT NOT NULL,
    "ucNumber" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_clientNumber_key" ON "Consumer"("clientNumber");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
