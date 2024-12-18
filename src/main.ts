import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { environment } from "./environment/environment";
import { connectRedisCache } from "./providers/redis/redis-client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(environment.port);
  new Logger().log(`Server is Running: ${environment.port}`, "SERVER");
  await connectRedisCache();
  new Logger().log(`Redis is Running: ${environment.redisCachePort}`, "RedisClient");
}

bootstrap();
