import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    AuthJwtService,
    UploadFileFactoryService,
  ],
})
export class ProductModule {}
