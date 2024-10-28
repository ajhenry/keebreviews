-- CreateTable
CREATE TABLE "Switch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "averageRatings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Switch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_switchId_fkey" FOREIGN KEY ("switchId") REFERENCES "Switch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
