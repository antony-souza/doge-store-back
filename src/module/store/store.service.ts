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
      // Verifica se já existe uma configuração com as mesmas propriedades(Entender)
      let storeConfig = await this.prisma.storeConfig.findFirst({
        where: {
          image: storeConfigDto.image,
          description: storeConfigDto.description,
          location: storeConfigDto.location,
          backgroundColor: storeConfigDto.backgroundColor,
        },
      });

      // Cria a configuração se não existir as propriedades(Entender)
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

      // Verifica se já existe uma loja com o mesmo nome e configuração(Entender)
      const existingStore = await this.prisma.storeAndStoreConfig.findFirst({
        where: {
          store: {
            name: storeDto.name,
          },
          storeConfig: {
            id: storeConfig.id,
          },
        },
      });

      if (existingStore) {
        throw new ConflictException(
          "Store with the same name and configuration already exists.",
          //"Já existe uma loja com o mesmo nome e configuração."
        );
      }

      // Cria a loja e associa a configuração(Entender)
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
              storeConfig: true, // Inclui detalhes de StoreConfig na resposta(Entender)
            },
          },
        },
      });

      return createStoreWithConfig;
    } catch (err) {
      throw new ConflictException("message:", err);
    }
  }
}
