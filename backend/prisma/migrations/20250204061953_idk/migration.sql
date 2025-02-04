-- AlterTable
ALTER TABLE "Aadhar" ADD COLUMN     "aadharImgUrl" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "panNo" TEXT;
