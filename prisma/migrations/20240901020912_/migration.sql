/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_and_store_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "store_and_store_configs" DROP CONSTRAINT "store_and_store_configs_storeConfigId_fkey";

-- DropForeignKey
ALTER TABLE "store_and_store_configs" DROP CONSTRAINT "store_and_store_configs_storeId_fkey";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "store_and_store_configs";

-- DropTable
DROP TABLE "store_configs";

-- DropTable
DROP TABLE "stores";

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_config" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_and_store_config" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "storeConfigId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_and_store_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_and_store_config_storeId_key" ON "store_and_store_config"("storeId");

-- AddForeignKey
ALTER TABLE "store_and_store_config" ADD CONSTRAINT "store_and_store_config_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_and_store_config" ADD CONSTRAINT "store_and_store_config_storeConfigId_fkey" FOREIGN KEY ("storeConfigId") REFERENCES "store_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
