import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaClient } from "@prisma/client";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthJwtService } from "../../jwt/auth.jwt.service";
import { ImgurUploadService } from "src/util/imgur-upload.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "bearer" }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: "1h" },
      secret: process.env.TOKEN_KEY,
    }),
  ],
  providers: [
    UserService,
    PrismaService,
    AuthJwtService,
    PrismaClient,
    ImgurUploadService,
  ],
  controllers: [UserController],
  exports: [JwtModule, AuthJwtService],
})
export class UserModule {}
