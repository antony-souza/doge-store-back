/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `store_config` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `store_config` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `store_config` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `store_config` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `store_design` table. All the data in the column will be lost.
  - Added the required column `address` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingHours` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialMedia` to the `store_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backgroundColor` to the `store_design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `store_design` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_config" DROP COLUMN "backgroundColor",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "openingHours" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "socialMedia" TEXT NOT NULL,
ALTER COLUMN "isOpen" DROP DEFAULT;

-- AlterTable
ALTER TABLE "store_design" DROP COLUMN "name",
ADD COLUMN     "backgroundColor" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;
