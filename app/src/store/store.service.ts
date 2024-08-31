import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ConfigStoreDto, StoreDto } from "./storeDTO/store-info.dto";

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async createStoreAndConfig(storeDto: StoreDto, storeConfigDto: ConfigStoreDto) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      
      const store = await prisma.store.create({
        data: {
          name: storeDto.name,
        },
      });

      const storeConfig = await prisma.storeConfig.create({
        data: {
          image: storeConfigDto.image,
          description: storeConfigDto.description,
          isOpen: storeConfigDto.isOpen,
          location: storeConfigDto.location,
          backgroundColor: storeConfigDto.backgroundColor,
        },
      });

      // Cria a associação StoreAndStoreConfig
      const storeAndStoreConfig = await prisma.storeAndStoreConfig.create({
        data: {
          storeId: store.id,
          storeConfigId: storeConfig.id,
        },
      });

      return {
        store,
        storeConfig,
        storeAndStoreConfig,
      };
    });

    return result;
  }
}
