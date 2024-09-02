import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ConfigStoreDto, StoreDto } from "./storeDTO/store-info.dto";

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createStoreAndConfig(
    storeDto: StoreDto,
    storeConfigDto: ConfigStoreDto,
  ) {
    try {
      // Verifica se já existe uma configuração com as mesmas propriedades(Compreensão de código)
      let storeConfig = await this.prisma.storeConfig.findFirst({
        where: {
          image_url: storeConfigDto.image_url,
          description: storeConfigDto.description,
          address: storeConfigDto.address,
          background_color: storeConfigDto.background_color,
          phone: storeConfigDto.phone,
        },
      });

      // Cria a configuração se não existir(Compreensão de código)
      if (!storeConfig) {
        storeConfig = await this.prisma.storeConfig.create({
          data: {
            name: storeConfigDto.name,
            image_url: storeConfigDto.image_url,
            description: storeConfigDto.description,
            is_open: storeConfigDto.is_open,
            phone: storeConfigDto.phone,
            address: storeConfigDto.address,
            background_color: storeConfigDto.background_color,
          },
        });
      }

      // Verifica se já existe uma loja com o mesmo nome(Compreensão de código)
      const existingStore = await this.prisma.store.findFirst({
        where: {
          name: storeDto.name,
        },
      });

      if (existingStore) {
        throw new ConflictException("Store with the same name already exists.");
      }

      const store = await this.prisma.store.create({
        data: {
          name: storeDto.name,
        },
      });

      // Cria a entrada na tabela intermediária para associar a loja e a configuração(Compreensão de código)
      await this.prisma.storeAndStoreConfig.create({
        data: {
          store_id: store.id,
          store_config_id: storeConfig.id,
        },
      });

      return {
        message: "Store created successfully",
        data: {
          store: store,
          store_config: storeConfig,
        },
      };
    } catch (err) {
      throw new ConflictException(
        "An error occurred while creating the store.",
        err.message,
      );
    }
  }
}
