import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import ProductRepository from "../../repositories/product-repository";
import RedisClient from "src/providers/redis/redis-client";
import { PrismaClient } from "@prisma/client";

@Module({
  controllers: [ProductController],
  imports: [],
  providers: [
    ProductService,
    AuthJwtService,
    UploadFileFactoryService,
    ProductRepository,
    RedisClient,
    PrismaClient,
  ],
})
export class ProductModule {}
