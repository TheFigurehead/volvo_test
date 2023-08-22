/*
  Warnings:

  - You are about to drop the column `tokenId` on the `Customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_customerId_fkey";

-- DropIndex
DROP INDEX "Customer_tokenId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "tokenId";

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
