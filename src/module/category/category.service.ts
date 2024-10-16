import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "src/database/prisma.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const url = await this.UploadFileFactoryService.upload(
      createCategoryDto.image_url,
    );

    const response = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        store_id: createCategoryDto.store_id,
        image_url: [url],
      },
    });

    return response;
  }

  async findAll() {
    return await this.prismaService.category.findMany({
      where: {
        enabled: true,
      },
    });
  }

  async findAllCategoryByStoreId(categoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prismaService.store.count({
      where: {
        id: categoryDto.store_id,
      },
    });

    if (existingCategory === 0) {
      throw new NotFoundException("Store not found");
    }

    return await this.prismaService.category.findMany({
      where: {
        store_id: categoryDto.store_id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        id: updateCategoryDto.id,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException("Category not found");
    }

    let [url] = existingCategory.image_url;

    if (updateCategoryDto.image_url) {
      url = await this.UploadFileFactoryService.upload(
        updateCategoryDto.image_url,
      );
    }
    return await this.prismaService.category.update({
      where: {
        id: updateCategoryDto.id,
      },
      data: {
        ...updateCategoryDto,
        image_url: [url],
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
