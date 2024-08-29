import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { PrismaModule } from '../prisma/prisma.module';
import PrismaService from '../prisma/prisma.service';

@Module({
  imports: [StoreModule, PrismaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
