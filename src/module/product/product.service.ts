import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import ProductRepository from "../../repositories/product-repository";
import { ProductEntity } from "./entities/product.entity";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProductService {
  constructor(
    public readonly prismaService: PrismaClient,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  findMany(dto: UpdateProductDto): Promise<ProductEntity[]> {
    return this.productRepository.findMany(dto);
  }

  findOne(dto: UpdateProductDto): Promise<ProductEntity> {
    return this.productRepository.findOne(dto);
  }

  async update(updateProductDto: UpdateProductDto) {
    return this.productRepository.update(updateProductDto);
  }

  async remove(dto: UpdateProductDto) {
    return this.productRepository.remove(dto);
  }

  async getFeaturedProducts(id: string) {
    const existingStore = await this.prismaService.store.count({
      where: {
        id: id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Loja não encontrada");
    }

    const featuredProducts = await this.prismaService.product.findMany({
      where: {
        store_id: id,
        promotion: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image_url: true,
        store: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!featuredProducts) {
      throw new NotFoundException("Nenhum produto destacado encontrado");
    }

    return featuredProducts;
  }
}
