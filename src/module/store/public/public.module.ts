import { Module } from "@nestjs/common";
import { PublicService } from "./public.service";
import { PublicController } from "./public.controller";
import { PrismaService } from "src/database/prisma.service";
import { StoreService } from "../store.service";
import UploadFileService from "src/util/upload-file.service";
import { ImgurUploadService } from "src/util/imgur-upload.service";

@Module({
  controllers: [PublicController],
  providers: [
    PublicService,
    PrismaService,
    StoreService,
    UploadFileService,
    ImgurUploadService,
  ],
  imports: [],
})
export class PublicModule {}
