/*
  Warnings:

  - You are about to drop the `Aadhar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Aadhar" DROP CONSTRAINT "Aadhar_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aadharNo" TEXT,
ADD COLUMN     "address" TEXT;

-- DropTable
DROP TABLE "Aadhar";
