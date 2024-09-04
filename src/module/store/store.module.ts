import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";

@Module({
  providers: [StoreService, PrismaService, AuthJwtService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
