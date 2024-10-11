import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import { UpdateStore } from "./Dtos/update-store.dto";

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadFilService: UploadFileFactoryService,
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
      },
    });

    if (store.length === 0) {
      throw new NotFoundException("Store not found");
    }

    console.log(store);
    return store;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const existingStore = await this.prisma.store.count({
      where: {
        name: createStoreDto.name,
      },
    });

    if (existingStore) {
      throw new ConflictException("Store already exists");
    }

    let url = "";
    url = await this.uploadFilService.upload(createStoreDto.image_url);

    const createdStore = await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        phone: createStoreDto.phone,
        address: createStoreDto.address,
        description: createStoreDto.description,
        is_open: createStoreDto.is_open,
        background_color: createStoreDto.background_color,
        image_url: url,
        users: {
          connect: {
            id: createStoreDto.user_id,
          },
        },
      },
      include: {
        users: {
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
      createdStore,
    };
  }

  async updateStore(updateStoreDto: UpdateStore) {
    const existingStore = await this.prisma.store.findUnique({
      where: { id: updateStoreDto.id },
    });

    if (!existingStore) {
      throw new NotFoundException("Store not found");
    }

    let url = existingStore.image_url;

    if (updateStoreDto.image_url) {
      url = await this.uploadFilService.upload(updateStoreDto.image_url);
    }

    const updatedStore = await this.prisma.store.update({
      where: { id: updateStoreDto.id },
      data: {
        name: updateStoreDto.name ?? existingStore.name,
        phone: updateStoreDto.phone ?? existingStore.phone,
        address: updateStoreDto.address ?? existingStore.address,
        description: updateStoreDto.description ?? existingStore.description,
        is_open: updateStoreDto.is_open ?? existingStore.is_open,
        background_color:
          updateStoreDto.background_color ?? existingStore.background_color,
        image_url: url,
      },
    });

    return {
      message: "Store updated successfully",
      data: updatedStore,
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
}
