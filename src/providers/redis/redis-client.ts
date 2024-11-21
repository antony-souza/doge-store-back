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

  setValue(key: string, value: string): Promise<string> {
    return this.set(key, JSON.stringify(value), "EX", 15);
  }

  async testConnection(): Promise<void> {
    try {
      await this.ping();
      this.logger.log("Redis connected successfully!", "REDIS");
    } catch (error) {
      this.logger.error("Redis connection failed!", "REDIS");
      throw error;
    }
  }
}

export const connectRedis = async (): Promise<void> => {
  await new RedisClient().testConnection();
};
