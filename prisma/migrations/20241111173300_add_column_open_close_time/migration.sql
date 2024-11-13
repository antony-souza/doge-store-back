/*
  Warnings:

  - You are about to drop the column `is_open` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "store" DROP COLUMN "is_open",
ADD COLUMN     "close_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "open_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
