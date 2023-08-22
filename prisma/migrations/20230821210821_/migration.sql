/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_tokenId_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_customerId_key" ON "Token"("customerId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
