import { Module } from "@nestjs/common";
import { QrcodeService } from "./qrcode.service";
import { QrcodeController } from "./qrcode.controller";
import { AuthJwtService } from "src/jwt/auth.jwt.service";

@Module({
  controllers: [QrcodeController],
  providers: [QrcodeService, AuthJwtService],
})
export class QrcodeModule {}
