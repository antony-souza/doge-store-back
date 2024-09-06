/*
  Warnings:

  - You are about to drop the column `image_url` on the `featured_products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `featured_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "featured_products" DROP COLUMN "image_url",
DROP COLUMN "name";
