import { Module } from "@nestjs/common";
import { StoreModule } from "./module/store/store.module";
import { PrismaService } from "./database/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./module/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./module/auth/auth.module";
import { CategoryModule } from "./module/category/category.module";

@Module({
  imports: [
    StoreModule,
    UserModule,
    JwtModule,
    AuthModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
