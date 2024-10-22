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
        description: true,
        background_image: true,
        background_color: true,
      },
    });

    return store;
  }

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
        background_image: true,
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
    image_url = await this.uploadFilService.upload(createStoreDto.image_url);

    let background_image = "";
    background_image = await this.uploadFilService.upload(
      createStoreDto.background_image,
    );

    const createdStore = await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        phone: createStoreDto.phone,
        address: createStoreDto.address,
        description: createStoreDto.description,
        is_open: createStoreDto.is_open,
        background_image: background_image,
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

    let image_url = existingStore.image_url;
    let background_image = existingStore.background_image;

    if (updateStoreDto.image_url) {
      image_url = await this.uploadFilService.upload(updateStoreDto.image_url);
    }

    if (updateStoreDto.background_image) {
      background_image = await this.uploadFilService.upload(
        updateStoreDto.background_image,
      );
    }

    const updatedStore = await this.prisma.store.update({
      where: { id: updateStoreDto.id },
      data: {
        ...updateStoreDto,
        image_url: image_url,
        background_image: background_image,
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
      where: { store_id: id },
    });

    await this.prisma.product.deleteMany({
      where: { store_id: id },
    });

    await this.prisma.category.deleteMany({
      where: { store_id: id },
    });

    await this.prisma.store.delete({
      where: { id },
    });

    return {
      message: "Store and all related data deleted successfully",
    };
  }
}
