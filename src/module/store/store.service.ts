import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import UploadFileService from "src/util/upload-file.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { CreateStoreConfigDto } from "./Dtos/create-store-cofig.dto";

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadFilService: UploadFileService,
  ) {}

  /* Searchs Public(FrontHome) And Private(DogeAdmin)*/
  async getStoreByName(query: { storeName: CreateStoreDto["name"] }) {
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

  async createStoreAndConfig(
    createStoreDto: CreateStoreDto,
    createStoreConfigDto: CreateStoreConfigDto,
  ) {
    // Executa ambas as contagens(buscas) em paralelo
    const [checkIfExistStore, checkIfExistStoreConfig] = await Promise.all([
      this.prisma.store.count({
        where: {
          name: createStoreDto.name,
        },
      }),
      this.prisma.storeConfig.count({
        where: {
          name: createStoreConfigDto.name,
        },
      }),
    ]);

    if (checkIfExistStore > 0) {
      throw new ConflictException("Store Already Created");
    }
    if (checkIfExistStoreConfig > 0) {
      throw new ConflictException("StoreConfig Already Created");
    }

    let url = "";

    if (createStoreConfigDto.upload_file) {
      // Faz o upload da foto, se fornecido
      url = await this.uploadFilService.upload(
        createStoreConfigDto.upload_file,
      );
    }

    // Cria a loja e a configuração da loja
    return await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        store_config: {
          create: {
            name: createStoreConfigDto.name,
            phone: createStoreConfigDto.phone,
            address: createStoreConfigDto.address,
            description: createStoreConfigDto.description,
            is_open: createStoreConfigDto.is_open,
            background_color: createStoreConfigDto.background_color,
            image_url: url,
          },
        },
      },
    });
  }

  async deleteStoreAndRelationships(createStoreDto: CreateStoreDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: createStoreDto.id },
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

    await this.prisma.productAndAddtionalDishe.deleteMany({
      where: { store_id: createStoreDto.id },
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
