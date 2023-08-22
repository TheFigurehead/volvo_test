/*
  Warnings:

  - A unique constraint covering the columns `[activateCode]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "activateCode" TEXT,
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_activateCode_key" ON "Customer"("activateCode");
