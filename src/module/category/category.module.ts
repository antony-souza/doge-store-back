import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaService,
    AuthJwtService,
    CategoryService,
    UploadFileFactoryService,
  ],
})
export class CategoryModule {}
