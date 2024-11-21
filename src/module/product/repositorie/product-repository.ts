import { Injectable } from "@nestjs/common";
import { Product } from "../entities/product.entity";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";

@Injectable()
export default class ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisClient: RedisClient,
  ) {}

  async findMany(storeId: string): Promise<Product[]> {
    const cacheKey = `store:${storeId}:products`;

    const cachedData = await this.redisClient.getValue(cacheKey);
    if (cachedData) {
      console.log("Buscou no cache");
      return JSON.parse(cachedData) as Product[];
    }
    console.log("Buscou no banco");
    const products = await this.prisma.product.findMany({
      where: {
        store_id: storeId,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        category_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
      },
    });

    // Armazena os resultados no cache
    await this.redisClient.setValue(cacheKey, JSON.stringify(products));

    return products;
  }
}
