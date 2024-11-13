import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

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
            featured_product: true,
          },
        },
      },
    });

    if (store.length === 0) {
      throw new NotFoundException("Store not found");
    }

    return store;
  }

  async getFeaturedProducts(id: string) {
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
        featured_product: true,
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
  }
}
