/*
  Warnings:

  - Added the required column `level` to the `interviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `interviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "finalized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "questions" TEXT[],
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "techstack" TEXT[],
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;
