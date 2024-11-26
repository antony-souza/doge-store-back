import { Module } from "@nestjs/common";
import { PublicService } from "./public.service";
import { PublicController } from "./public.controller";
import { PrismaService } from "src/database/prisma.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import { ImgurUploadService } from "src/util/upload-service/imgur-upload.service";

@Module({
  controllers: [PublicController],
  providers: [
    PublicService,
    PrismaService,
    UploadFileFactoryService,
    ImgurUploadService,
  ],
  imports: [],
})
export class PublicModule {}
