import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";

@Module({
  providers: [AuthService, AuthJwtService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
