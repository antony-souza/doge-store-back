/*
  Warnings:

  - You are about to drop the `featured_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "featured_product" DROP CONSTRAINT "featured_product_product_id_fkey";

-- DropForeignKey
ALTER TABLE "featured_product" DROP CONSTRAINT "featured_product_store_id_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "featured_product" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "featured_product";
