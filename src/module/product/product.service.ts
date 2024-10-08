import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "src/database/prisma.service";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const [checkIfExistCategory, checkIfExistStore] = await Promise.all([
      this.prismaService.category.count({
        where: {
          id: createProductDto.category_id,
          store_id: createProductDto.store_id,
        },
      }),
      this.prismaService.store.count({
        where: {
          id: createProductDto.store_id,
        },
      }),
    ]);

    if (!checkIfExistCategory) {
      throw new BadRequestException("Category Already Created");
    }

    if (!checkIfExistStore) {
      throw new BadRequestException("Store not found");
    }

    let url = "";

    if (createProductDto.upload_file) {
      url = await this.UploadFileFactoryService.upload(
        createProductDto.upload_file,
      );
    }

    return await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        category_id: createProductDto.category_id,
        store_id: createProductDto.store_id,
        price: Number(createProductDto.price),
        image_url: [url],
      },
    });
  }

  async findAll(store_id: string) {
    return await this.prismaService.product.findMany({
      where: {
        store_id: store_id,
        enabled: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.product.findFirst({
      where: {
        id,
      },
    });
  }

  async update(updateProductDto: UpdateProductDto) {
    console.log("Atualizando produto:", updateProductDto);
    const existingProduct = await this.prismaService.product.findUnique({
      where: {
        id: updateProductDto.id,
      },
    });
    if (!existingProduct) {
      throw new BadRequestException("Product not found");
    }

    let [url] = existingProduct.image_url;

    if (updateProductDto.upload_file) {
      url = await this.UploadFileFactoryService.upload(
        updateProductDto.upload_file,
      );
    }

    return await this.prismaService.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        image_url: [url],
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        enabled: false,
      },
    });
  }
}
