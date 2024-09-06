import { Module } from "@nestjs/common";

import { PublicController } from "./public.controller";
import { PublicStoreService } from "./public.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [PublicStoreService, PrismaService],
  controllers: [PublicController],
})
export class PublicStoreModule {}
