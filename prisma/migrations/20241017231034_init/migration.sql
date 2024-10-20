-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "energyQuantity" DOUBLE PRECISION NOT NULL,
    "energyValue" DOUBLE PRECISION NOT NULL,
    "sceeQuantity" DOUBLE PRECISION NOT NULL,
    "sceeValue" DOUBLE PRECISION NOT NULL,
    "compensatedGD" DOUBLE PRECISION NOT NULL,
    "publicLightingFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
