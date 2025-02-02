/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_refreshToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "walletId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
