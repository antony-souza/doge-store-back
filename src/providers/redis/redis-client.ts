import { Logger } from "@nestjs/common";
import Redis from "ioredis";
import { environment } from "src/environment/environment";

export class RedisClient extends Redis {
  private readonly logger = new Logger("REDIS");

  constructor() {
    super({
      host: environment.redisCacheHost,
      port: environment.redisCachePort,
      password: environment.redisCachePassword,
      maxRetriesPerRequest: 5,
    });
  }

  getValue(key: string): Promise<string> {
    return this.get(key);
  }

  setValue(key: string, value: string): Promise<string> {
    return this.set(key, value, "EX", 15);
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
