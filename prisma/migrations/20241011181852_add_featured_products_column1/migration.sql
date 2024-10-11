/*
  Warnings:

  - You are about to drop the column `featured_products` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "featured_products",
ADD COLUMN     "featuredProducts" BOOLEAN DEFAULT false;
