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

  async getAllStore() {
    const store = await this.prisma.store.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        is_open: true,
        image_url: true,
        banner_url: true,
        description: true,
        background_color: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return store;
  }

  //Mapear os dados do store na interface
  async getStoreClient(id: string) {
    const existingStore = await this.prisma.store.count({
      where: {
        id: id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Store not found");
    }

    const storeData = await this.prisma.store.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        is_open: true,
        banner_url: true,
        address: true,
        image_url: true,
        description: true,
        background_color: true,
      },
    });

    return storeData;
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

    let image_url = "";
    image_url = await this.uploadFilService.upload(createStoreDto.image_url[0]);

    let banner_url = "";
    banner_url = await this.uploadFilService.upload(
      createStoreDto.banner_url[0],
    );

    const isOpen = createStoreDto.is_open === "true";
    const createdStore = await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        phone: createStoreDto.phone,
        address: createStoreDto.address,
        description: createStoreDto.description,
        banner_url: banner_url,
        is_open: isOpen,
        background_color: createStoreDto.background_color,
        image_url: image_url,
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
      url = await this.uploadFilService.upload(updateStoreDto.image_url[0]);
    }

    let banner_url = existingStore.banner_url;

    if (updateStoreDto.banner_url) {
      banner_url = await this.uploadFilService.upload(
        updateStoreDto.banner_url[0],
      );
    }
    const isOpen = updateStoreDto.is_open === "true";
    const updatedStore = await this.prisma.store.update({
      where: { id: updateStoreDto.id },
      data: {
        ...updateStoreDto,
        image_url: url,
        banner_url: banner_url,
        is_open: isOpen,
      },
    });

    return {
      message: "Store updated successfully",
      data: updatedStore,
    };
  }

  async deleteStoreAndRelationships(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    await this.prisma.store.delete({
      where: { id },
      include: {
        category: true,
        product: true,
        ProductAndAddtionalDishe: true,
      },
    });

    return {
      message: "Store and all related data deleted successfully",
    };
  }
}
