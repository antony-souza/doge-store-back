import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ConfigStoreDto, StoreDto } from "./storeDTO/store-info.dto";

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createAndAssociateConfigToStore(
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

  async createAndAssociateCategoriesToStore(body: {
    storeId: string;
    categories: { name: string; imageUrl: string }[];
  }) {
    const { storeId, categories } = body;

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    // Cria as categorias e as associa à loja
    const createdCategories = await this.prisma.category.createMany({
      data: categories.map((category) => ({
        ...category,
        store_id: storeId, // Associa o storeId a cada categoria
      })),
    });

    return {
      message: "Categories created and associated to store successfully",
      createdCategories,
    };
  }

  async createAndAssociateProductToStore(body: {
    store_id: string;
    products: {
      name: string;
      price: number;
      image_url: string[];
      category_id: string;
    }[];
  }) {
    const { store_id, products } = body;

    const store = await this.prisma.store.findUnique({
      where: { id: store_id },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    // Cria os produtos(que contem a category dentro) e os associa à loja
    const createdProducts = await this.prisma.product.createMany({
      data: products.map((product) => ({
        ...product,
        store_id: store_id,
        category_id: product.category_id,
      })),
    });

    return {
      message:
        "Products created and associated to store and category successfully",
      createdProducts,
    };
  }

  async deleteStoreAndRelationships(body: { store_id: string }) {
    const { store_id } = body;
    const store = await this.prisma.store.findUnique({
      where: { id: store_id },
      include: {
        store_config: true,
        category: true,
        product: true,
        ProductAndAddtionalDishe: true,
      },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    // Deletar os registros relacionados na tabela ProductAndAdditionalDishe
    await this.prisma.productAndAddtionalDishe.deleteMany({
      where: { store_id: store_id },
    });

    // Deletar os produtos relacionados à loja
    await this.prisma.product.deleteMany({
      where: { store_id: store_id },
    });

    // Deletar as categorias relacionadas à loja
    await this.prisma.category.deleteMany({
      where: { store_id: store_id },
    });

    // Deletar as configurações relacionadas à loja
    await this.prisma.storeAndStoreConfig.deleteMany({
      where: { store_id: store_id },
    });

    // Finalmente, deletar a loja
    await this.prisma.store.delete({
      where: { id: store_id },
    });

    return {
      message: "Store and all related data deleted successfully",
    };
  }

  /*  async deleteAllStoreConfigs() {
    const storeConfigs = await this.prisma.storeConfig.findMany();

    if (storeConfigs.length === 0) {
      throw new NotFoundException("No store configurations found");
    }

    await this.prisma.storeConfig.deleteMany({});

    return {
      message: "All store configurations deleted successfully",
    };
  } */
}
