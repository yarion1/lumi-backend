/*
  Warnings:

  - Added the required column `compensatedGDValue` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "compensatedGDValue" DOUBLE PRECISION NOT NULL;
