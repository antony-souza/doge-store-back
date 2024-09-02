/*
  Warnings:

  - You are about to drop the `store_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_design` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_design_config` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "store_design_config" DROP CONSTRAINT "store_design_config_storeConfigId_fkey";

-- DropForeignKey
ALTER TABLE "store_design_config" DROP CONSTRAINT "store_design_config_storeDesignId_fkey";

-- DropForeignKey
ALTER TABLE "store_design_config" DROP CONSTRAINT "store_design_config_storeId_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "image_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "store_id" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "store_config";

-- DropTable
DROP TABLE "store_design";

-- DropTable
DROP TABLE "store_design_config";

-- CreateTable
CREATE TABLE "store_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT NOT NULL,
    "background_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_and_store_configs" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "store_config_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_and_store_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "image_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_dishe" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "additional_dishe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_additional_dishe" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "store_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "additional_dish_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_additional_dishe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_and_store_configs_store_id_key" ON "store_and_store_configs"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_and_store_configs_store_config_id_key" ON "store_and_store_configs"("store_config_id");

-- AddForeignKey
ALTER TABLE "store_and_store_configs" ADD CONSTRAINT "store_and_store_configs_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_and_store_configs" ADD CONSTRAINT "store_and_store_configs_store_config_id_fkey" FOREIGN KEY ("store_config_id") REFERENCES "store_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_additional_dishe" ADD CONSTRAINT "product_additional_dishe_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_additional_dishe" ADD CONSTRAINT "product_additional_dishe_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_additional_dishe" ADD CONSTRAINT "product_additional_dishe_additional_dish_id_fkey" FOREIGN KEY ("additional_dish_id") REFERENCES "additional_dishe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
