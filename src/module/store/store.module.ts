import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import { PublicModule } from "./public/public.module";
import { PublicService } from "./public/public.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import { StoreRepository } from "src/repositories/store-repository";
import RedisClient from "src/providers/redis/redis-client";

@Module({
  providers: [
    StoreService,
    PrismaService,
    AuthJwtService,
    PublicService,
    UploadFileFactoryService,
    StoreRepository,
    RedisClient
  ],
  controllers: [StoreController],
  exports: [StoreService],
  imports: [PublicModule],
})
export class StoreModule {}
