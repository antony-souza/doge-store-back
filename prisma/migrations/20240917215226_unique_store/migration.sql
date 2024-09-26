/*
  Warnings:

  - You are about to drop the `store_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `background_color` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "store_config" DROP CONSTRAINT "store_config_store_id_fkey";

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "background_color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "is_open" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "store_config";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_store_id_key" ON "users"("store_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
