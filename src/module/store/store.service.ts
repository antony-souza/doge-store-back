import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import UploadFileService from "src/util/upload-file.service";

export interface IStoreConfig {
  id: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  is_open: boolean;
  image_url: string;
  background_color: string;
}

export interface IProduct {
  name: string;
  price: number;
  image_url: string[];
  category_id: string;
}

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadFilService: UploadFileService,
  ) {}

  /* Searchs Public(FrontHome) And Private(DogeAdmin)*/
  async getStoreByName(query: { storeName: string }) {
    const { storeName } = query;

    console.log(storeName);

    const store = await this.prisma.store.findMany({
      where: { name: { equals: storeName, mode: "insensitive" } },
      include: {
        store_config: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            description: true,
            is_open: true,
            image_url: true,
            background_color: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            category_id: true,
          },
        },
        featured_products: {
          select: {
            id: true,
            store_id: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
                description: true,
                category_id: true,
              },
            },
          },
        },
      },
    });

    if (store.length === 0) {
      throw new NotFoundException("Store not found");
    }

    return store;
  }

  async createStoreAndConfig(body: {
    name: string;
    store_config: IStoreConfig;
  }) {
    const { name, store_config } = body;

    try {
      // Verifica se já existe uma loja com o mesmo nome e configuração
      const existingStore = await this.prisma.store.findFirst({
        where: { name },
        include: { store_config: true },
      });

      if (existingStore) {
        throw new ConflictException(
          `Store with name "${name}" and store_config ${store_config.name} already exists`,
        );
      }

      // Cria a loja com a configuração
      const store = await this.prisma.store.create({
        data: {
          name,
          store_config: {
            create: store_config,
          },
        },
      });

      return {
        message: "Store and store configuration created successfully",
        store,
      };
    } catch (error) {
      console.error("Error creating store and store configuration:", error);
      throw new InternalServerErrorException(
        "An error occurred while creating the store and store configuration.",
      );
    }
  }

  async createAndAssociateCategoriesToStore(body: {
    storeId: string;
    categories: { name: string; image_url: string[]; border_color: string }[];
  }) {
    const { storeId, categories } = body;

    // Verifica se a loja existe
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { store_config: true },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    const createdCategories = [];

    for (const category of categories) {
      // Verifica se a categoria já existe na loja
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          name: category.name,
          store_id: storeId,
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${category.name}" already exists in this store.`,
        );
      }

      // Cria a categoria se não existir, aplicando a cor de fundo da loja
      const newCategory = await this.prisma.category.create({
        data: {
          name: category.name,
          image_url: category.image_url,
          store_id: storeId,
        },
      });

      createdCategories.push(newCategory);
    }

    return {
      message: "Categories created and associated to store successfully",
      createdCategories,
    };
  }

  async createAndAssociateProductToStore(body: {
    store_id: string;
    products: IProduct[];
  }) {
    const { store_id, products } = body;

    const store = await this.prisma.store.findUnique({
      where: { id: store_id },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    const createdProducts = [];
    for (const product of products) {
      // Verifica item(produto) por item(produto) se já existe na loja
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          name: product.name,
          store_id: store_id,
          category_id: product.category_id,
        },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with name "${product.name}" already exists in this store.`,
        );
      }

      // Cria o produto se não existir
      const createdProduct = await this.prisma.product.create({
        data: {
          ...product,
          store_id: store_id,
        },
      });

      createdProducts.push(createdProduct);
    }

    return {
      message:
        "Products created and associated to store and category successfully",
      createdProducts,
    };
  }

  async createAndAssociateFeaturedProducts(body: {
    store_id: string;
    product_ids: string[]; // IDs dos produtos para o destaque
  }) {
    const { store_id, product_ids } = body;

    // Verifica se a loja existe
    const store = await this.prisma.store.findUnique({
      where: { id: store_id },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    // Cria o registro de FeaturedProducts
    const featuredProducts = await this.prisma.featuredProducts.create({
      data: {
        store: { connect: { id: store_id } }, // Conecta a loja
        product: {
          connect: product_ids.map((id) => ({ id })), // Conecta os produtos existentes
        },
      },
      include: {
        product: true, // Inclui os produtos associados na resposta
        store: true, // Inclui a loja associada na resposta
      },
    });

    return {
      message: "Featured products created and associated successfully",
      featuredProducts,
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

    await this.prisma.storeConfig.deleteMany({
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

  async uploadLogo(storeConfigId: string, file: Express.Multer.File) {
    const checkIfExistStoreConfigId = await this.prisma.storeConfig.count({
      where: {
        id: storeConfigId ?? "",
      },
    });

    if (!checkIfExistStoreConfigId) {
      throw new BadRequestException("storeConfigId not found");
    }

    const url = await this.uploadFilService.upload(file);

    return await this.prisma.storeConfig.update({
      where: {
        id: storeConfigId,
      },
      data: {
        image_url: url,
      },
    });
  }
}
