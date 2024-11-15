import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UpdateCategoryDto } from "src/module/category/dto/update-category.dto";

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreByName(name: string) {
    const store = await this.prisma.store.findMany({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
        product: {
          where: {
            enabled: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            image_url: true,
            category_id: true,
            enabled: true,
            promotion: true,
          },
        },
      },
    });

    if (store.length === 0) {
      throw new NotFoundException("Store not found");
    }

    return store;
  }

  /* async getFeaturedProducts(id: string) {
    const existingStore = await this.prisma.store.count({
      where: {
        id: id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Loja não encontrada");
    }

    const featuredProducts = await this.prisma.product.findMany({
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
      },
    });

    if (!featuredProducts) {
      throw new NotFoundException("Nenhum produto destacado encontrado");
    }

    return featuredProducts;
  } */
  async getAllStores() {
    const stores = await this.prisma.store.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return stores;
  }

  async getAllProductsByCategoryId(dto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.count({
      where: {
        id: dto.id,
        store_id: dto.store_id,
      },
    });

    if (existingCategory === 0) {
      throw new NotFoundException("Categoria ou Loja não encontrada");
    }

    return await this.prisma.product.findMany({
      where: {
        category_id: dto.id,
        store_id: dto.store_id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image_url: true,
        promotion: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
