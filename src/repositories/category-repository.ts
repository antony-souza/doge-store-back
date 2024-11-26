import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UpdateCategoryDto } from "src/module/category/dto/update-category.dto";
import { CategoryEntity } from "src/module/category/entities/category.entity";

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaClient) { }

  async create() {
    return "Create category";
  }

  async findMany(dto: UpdateCategoryDto):Promise<CategoryEntity[]> {

    return await this.prismaService.category.findMany({
      where: {
        store_id: dto.store_id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        store_id: true,
      }
    })
  }

  remove(dto: UpdateCategoryDto) {
    return this.prismaService.category.update({
      where: {
        id: dto.id,
      },
      data: {
        enabled: false,
      },
    })
  }
}
