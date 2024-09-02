import { Module } from "@nestjs/common";
import { StoreModule } from "./module/store/store.module";
import { PrismaService } from "./database/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    StoreModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
