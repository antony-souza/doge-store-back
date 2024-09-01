/*
  Warnings:

  - You are about to drop the `store_and_store_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "store_and_store_config" DROP CONSTRAINT "store_and_store_config_storeConfigId_fkey";

-- DropForeignKey
ALTER TABLE "store_and_store_config" DROP CONSTRAINT "store_and_store_config_storeId_fkey";

-- DropTable
DROP TABLE "store_and_store_config";

-- CreateTable
CREATE TABLE "store_design" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_design_config" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "storeDesignId" TEXT NOT NULL,
    "storeConfigId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_design_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_design_config_storeId_key" ON "store_design_config"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "store_design_config_storeDesignId_key" ON "store_design_config"("storeDesignId");

-- CreateIndex
CREATE UNIQUE INDEX "store_design_config_storeConfigId_key" ON "store_design_config"("storeConfigId");

-- AddForeignKey
ALTER TABLE "store_design_config" ADD CONSTRAINT "store_design_config_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_design_config" ADD CONSTRAINT "store_design_config_storeDesignId_fkey" FOREIGN KEY ("storeDesignId") REFERENCES "store_design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_design_config" ADD CONSTRAINT "store_design_config_storeConfigId_fkey" FOREIGN KEY ("storeConfigId") REFERENCES "store_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
