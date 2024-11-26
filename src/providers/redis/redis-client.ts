import { Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { environment } from "src/environment/environment";

@Injectable()
export default class RedisClient extends Redis {
  private readonly logger = new Logger("RedisClient");

  constructor() {
    super({
      host: environment.redisCacheHost,
      port: environment.redisCachePort,
      password: environment.redisCachePassword,
      maxRetriesPerRequest: 5,
    });
  }

  async getValue(key: string): Promise<string> {
    const value = await this.get(key);

    return value ? JSON.parse(value) : null;
  }

  setValue(key: string, value: string, timeExp: number): Promise<string> {
    return this.set(key, JSON.stringify(value), "EX", timeExp);
  }

  delValue(key: string): Promise<number> {
    return this.del(key);
  }

  async testConnection(): Promise<void> {
    try {
      await this.ping();
      this.logger.log("Redis connected successfully!");
    } catch (error) {
      this.logger.error("Redis connection failed!");
      throw error;
    }
  }
}

export const connectRedisCache = async (): Promise<void> => {
  await new RedisClient().testConnection();
};
