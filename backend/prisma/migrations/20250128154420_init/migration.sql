-- CreateTable
CREATE TABLE "Aadhar" (
    "aadharId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aadhar_pkey" PRIMARY KEY ("aadharId")
);
