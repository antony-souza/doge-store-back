import { Logger } from "@nestjs/common";
import Redis from "ioredis";
import { environment } from "src/environment/environment";

export class RedisClient {
  public static instanceCache: Redis;

  public constructor() {
    if (!RedisClient.instanceCache) {
      RedisClient.instanceCache = new Redis(redisCacheConnectionOption);
    }
  }

  public async testConnection(): Promise<void> {
    await RedisClient.instanceCache
      .ping()
      .then(() => {
        Logger.log("Redis cache connected");
      })
      .catch((error) => {
        Logger.log(error.toString());
      });
  }
}

export const connectRedis = async (): Promise<void> => {
  await new RedisClient().testConnection();
};

export const redisCacheConnectionOption = {
  host: environment.redisCacheHost,
  port: environment.redisCachePort,
  password: environment.redisCachePassword,
  maxRetriesPerRequest: null,
};
