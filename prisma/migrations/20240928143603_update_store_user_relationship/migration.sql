-- DropIndex
DROP INDEX "users_store_id_key";

-- CreateIndex
CREATE INDEX "users_store_id_idx" ON "users"("store_id");
