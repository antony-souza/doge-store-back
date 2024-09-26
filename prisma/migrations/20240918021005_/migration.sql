-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_store_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "store_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
