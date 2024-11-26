import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import { CategoryRepository } from "src/repositories/category-repository";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaClient,
    AuthJwtService,
    CategoryService,
    RedisClient,
    CategoryRepository,
    UploadFileFactoryService,
  ],
})
export class CategoryModule {}
