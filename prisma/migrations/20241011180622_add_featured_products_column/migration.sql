/*
  Warnings:

  - You are about to drop the `_FeaturedProductsToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `featured_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FeaturedProductsToProduct" DROP CONSTRAINT "_FeaturedProductsToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_FeaturedProductsToProduct" DROP CONSTRAINT "_FeaturedProductsToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "featured_products" DROP CONSTRAINT "featured_products_store_id_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "featured_products" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_FeaturedProductsToProduct";

-- DropTable
DROP TABLE "featured_products";
