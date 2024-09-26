import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import UploadFileService from "src/util/upload-file.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { ImgurUploadService } from "src/util/imgur-upload.service";

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadFilService: UploadFileService,
    private readonly imgurFileUpload: ImgurUploadService,
  ) {}

  //Mapear os dados do store na interface do client
  async getStoreClient(store_id: string) {
    const existingStore = await this.prisma.store.count({
      where: {
        id: store_id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Store not found");
    }

    const storeData = await this.prisma.store.findUnique({
      where: {
        id: store_id,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        is_open: true,
        address: true,
        image_url: true,
        description: true,
        background_color: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return storeData;
  }

  /* Searchs Public(FrontHome) And Private(DogeAdmin)*/
  async getStoreByName(query: { name: string }) {
    const { name } = query;

    console.log(name);

    const existingStore = await this.prisma.store.count({
      where: {
        name: name,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Store not found");
    }

    const store = await this.prisma.store.findMany({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
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

    console.log(store);
    return store;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const { upload_file } = createStoreDto;
    const existingStore = await this.prisma.store.count({
      where: {
        name: createStoreDto.name,
      },
    });

    if (existingStore) {
      throw new ConflictException("Store already exists");
    }

    const url = await this.uploadFilService.upload(upload_file);

    const createdStore = await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        phone: createStoreDto.phone,
        address: createStoreDto.address,
        description: createStoreDto.description,
        is_open: createStoreDto.is_open,
        background_color: createStoreDto.background_color,
        image_url: url,
        user: {
          connect: {
            id: createStoreDto.user_id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: "Store created successfully",
      data: createdStore,
    };
  }

  async deleteStoreAndRelationships(createStoreDto: CreateStoreDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: createStoreDto.id },
      include: {
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

  async uploadLogo(store: CreateStoreDto, file: Express.Multer.File) {
    const checkIfExistStoreConfigId = await this.prisma.store.count({
      where: {
        id: store.id ?? "",
      },
    });

    if (!checkIfExistStoreConfigId) {
      throw new BadRequestException("storeConfigId not found");
    }

    const url = await this.uploadFilService.upload(file);

    return await this.prisma.store.update({
      where: {
        id: store.id,
      },
      data: {
        image_url: url,
      },
    });
  }
}
