import {
  Injectable,
} from "@nestjs/common";
import { ProductEntity } from "../module/product/entities/product.entity";
import { PrismaClient } from "@prisma/client";
import { UpdateProductDto } from "src/module/product/dto/update-product.dto";
import { CreateProductDto } from "src/module/product/dto/create-product.dto";

@Injectable()
export default class ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
  ) { }

  async findMany(dto: UpdateProductDto): Promise<ProductEntity[]> {
    
    return await this.prisma.product.findMany({
      where: {
        store_id: dto.store_id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(dto: UpdateProductDto): Promise<ProductEntity> {

    return await this.prisma.product.findUnique({
      where: {
        id: dto.id,
        store_id: dto.store_id,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(updateProductDto: UpdateProductDto) {
    
  }

  async remove(dto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: {
        id: dto.id,
      },
      data: {
        enabled: false,
      },
    });
  }
}
