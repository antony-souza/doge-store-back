import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import { PublicModule } from "./public/public.module";
import { PublicService } from "./public/public.service";
import UploadFileService from "src/util/upload-file.service";

@Module({
  providers: [
    StoreService,
    PrismaService,
    AuthJwtService,
    PublicService,
    UploadFileService,
  ],
  controllers: [StoreController],
  exports: [StoreService],
  imports: [PublicModule],
})
export class StoreModule {}
