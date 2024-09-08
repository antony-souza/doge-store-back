import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, AuthJwtService],
})
export class CategoryModule {}
