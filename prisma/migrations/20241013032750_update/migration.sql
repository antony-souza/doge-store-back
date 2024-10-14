/*
  Warnings:

  - You are about to drop the column `featuredProducts` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "featuredProducts",
ADD COLUMN     "featured_products" BOOLEAN DEFAULT false;
