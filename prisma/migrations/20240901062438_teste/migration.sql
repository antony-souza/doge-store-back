/*
  Warnings:

  - You are about to drop the column `openingHours` on the `store_config` table. All the data in the column will be lost.
  - Added the required column `openingHour` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `store_design` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_config" DROP COLUMN "openingHours",
ADD COLUMN     "openingHour" TEXT NOT NULL,
ALTER COLUMN "isOpen" SET DEFAULT true;

-- AlterTable
ALTER TABLE "store_design" ADD COLUMN     "name" TEXT NOT NULL;
