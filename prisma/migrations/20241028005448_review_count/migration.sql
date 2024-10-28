/*
  Warnings:

  - Added the required column `reviewsCount` to the `KeyboardSwitch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeyboardSwitch" ADD COLUMN     "reviewsCount" INTEGER NOT NULL;
