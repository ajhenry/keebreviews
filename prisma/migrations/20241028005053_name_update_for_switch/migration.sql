/*
  Warnings:

  - You are about to drop the `Switch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_switchId_fkey";

-- DropTable
DROP TABLE "Switch";

-- CreateTable
CREATE TABLE "KeyboardSwitch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "averageRatings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeyboardSwitch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_switchId_fkey" FOREIGN KEY ("switchId") REFERENCES "KeyboardSwitch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
