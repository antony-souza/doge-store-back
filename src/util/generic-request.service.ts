import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";

@Injectable()
export class GenericService<T> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: RedisClient,
    private readonly modelName: string,
  ) {}

  async findMany(): Promise<T[]> {
    const cacheKey = `${this.modelName}:all`;
    const cachedData = await this.redis.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await this.prisma[this.modelName].findMany();

    await this.redis.setValue(cacheKey, JSON.stringify(data));

    return data;
  }

  async findUnique(id: string): Promise<T> {
    const cacheKey = `${this.modelName}:${id}`;
    const cachedData = await this.redis.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await this.prisma[this.modelName].findUnique({
      where: { id },
    });

    await this.redis.setValue(cacheKey, JSON.stringify(data));

    return data;
  }
}
