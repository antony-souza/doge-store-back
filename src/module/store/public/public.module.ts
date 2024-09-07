import { Module } from "@nestjs/common";
import { PublicService } from "./public.service";
import { PublicController } from "./public.controller";
import { PrismaService } from "src/database/prisma.service";
import { StoreService } from "../store.service";

@Module({
  controllers: [PublicController],
  providers: [PublicService, PrismaService, StoreService],
  imports: [],
})
export class PublicModule {}
