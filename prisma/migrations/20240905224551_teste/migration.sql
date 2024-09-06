-- CreateTable
CREATE TABLE "featured_products" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "image_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "featured_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeaturedProductsToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FeaturedProductsToProduct_AB_unique" ON "_FeaturedProductsToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FeaturedProductsToProduct_B_index" ON "_FeaturedProductsToProduct"("B");

-- AddForeignKey
ALTER TABLE "featured_products" ADD CONSTRAINT "featured_products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturedProductsToProduct" ADD CONSTRAINT "_FeaturedProductsToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "featured_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturedProductsToProduct" ADD CONSTRAINT "_FeaturedProductsToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
