import { Injectable } from "@nestjs/common";
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
      createCategoryDto.upload_file,
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
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
