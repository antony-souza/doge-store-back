/*
  Warnings:

  - You are about to drop the `store_and_store_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "store_and_store_configs" DROP CONSTRAINT "store_and_store_configs_store_config_id_fkey";

-- DropForeignKey
ALTER TABLE "store_and_store_configs" DROP CONSTRAINT "store_and_store_configs_store_id_fkey";

-- DropTable
DROP TABLE "store_and_store_configs";

-- DropTable
DROP TABLE "store_configs";

-- CreateTable
CREATE TABLE "store_config" (
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
    "store_id" TEXT NOT NULL,

    CONSTRAINT "store_config_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "store_config" ADD CONSTRAINT "store_config_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
