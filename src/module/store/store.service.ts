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
      let storeConfig = await this.prisma.storeConfig.findFirst({
        where: {
          id: storeConfigDto.id,
        },
      });

      if (!storeConfig) {
        storeConfig = await this.prisma.storeConfig.create({
          data: {
            image: storeConfigDto.image,
            description: storeConfigDto.description,
            isOpen: storeConfigDto.isOpen,
            location: storeConfigDto.location,
            backgroundColor: storeConfigDto.backgroundColor,
          },
        });
      }

      // Cria a loja e associa a configuração existente ou nova
      const createStoreWithConfig = await this.prisma.store.create({
        data: {
          name: storeDto.name,
          storeConfig: {
            create: {
              storeConfig: {
                connect: {
                  id: storeConfig.id,
                },
              },
            },
          },
        },
        include: {
          storeConfig: {
            include: {
              storeConfig: true, // Inclui detalhes de StoreConfig na resposta
            },
          },
        },
      });

      return createStoreWithConfig;
    } catch (err) {
      throw new ConflictException(err);
    }
  }
}
