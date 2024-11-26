import * as dotenv from "dotenv";
dotenv.config();

class Environment {
  //App
  public readonly port: number = parseInt(process.env.PORT_1 ?? "");

  //Redis
<<<<<<< HEAD
  // eslint-disable-next-line prettier/prettier
  public readonly redisCacheHost: string = process.env.REDIS_CACHE_HOST ?? "";
  // eslint-disable-next-line prettier/prettier
=======
  public readonly redisCacheHost: string = process.env.REDIS_CACHE_HOST ?? "";
  // eslint-disable-next-line prettier/prettier
>>>>>>> dev
  public readonly redisCachePort: number = parseInt(process.env.REDIS_CACHE_PORT ?? "");
  // eslint-disable-next-line prettier/prettier
  public readonly redisCachePassword: string = process.env.REDIS_CACHE_PASSWORD ?? "";
}

export const environment = new Environment();
