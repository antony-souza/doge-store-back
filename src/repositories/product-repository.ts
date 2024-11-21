import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../module/product/entities/product.entity";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";
import { UpdateProductDto } from "src/module/product/dto/update-product.dto";

@Injectable()
export default class ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisClient: RedisClient,
  ) {}

  async findMany(dto: UpdateProductDto): Promise<ProductEntity[]> {
    const cacheKey = `store:${dto.id}:products`;

    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity[];
    }

    const products = await this.prisma.product.findMany({
      where: {
        store_id: dto.id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.redisClient.setValue(cacheKey, JSON.stringify(products));

    return products;
  }

  async findOne(dto: UpdateProductDto): Promise<ProductEntity> {
    const cacheKey = `product:${dto.id}`;

    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity;
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.id,
        store_id: dto.store_id,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return product;
  }
}
