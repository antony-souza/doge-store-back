import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import { CategoryRepository } from "src/repositories/category-repository";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";
import { CategoryEntity } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaClient,
    private readonly categoryRepository: CategoryRepository,
    private readonly redisClient: RedisClient,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
  ) { }

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

    const cacheKey = `store:${createCategoryDto.store_id}:categories`;
    await this.redisClient.del(cacheKey);

    return response;
  }

  async findAllCategoryByStoreId(dto: UpdateCategoryDto): Promise<CategoryEntity[]> {

    const cacheKey = `store:${dto.store_id}:categories`;
    const cacheData = await this.redisClient.getValue(cacheKey);

    const existingStore = await this.prismaService.store.count({
      where: {
        id: dto.store_id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Store not found");
    }

    if (cacheData) {
      return JSON.parse(cacheData);
    }

    const response = await this.categoryRepository.findMany(dto);

    await this.redisClient.setValue(cacheKey, JSON.stringify(response), 60 * 2);

    return response;
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


    const cacheKey = `store:${updateCategoryDto.store_id}:categories`;
    await this.redisClient.delValue(cacheKey)

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

  async remove(dto: UpdateCategoryDto) {
    return await this.categoryRepository.remove(dto)
  }
}

