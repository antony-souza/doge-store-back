import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "src/database/prisma.service";
import UploadFileService from "src/util/upload-file.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const url = await this.uploadFileService.upload(
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

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
