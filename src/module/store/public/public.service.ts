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
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            image_url: true,
            category_id: true,
            featured_products: true,
          },
        },
      },
    });

    if (store.length === 0) {
      throw new NotFoundException("Store not found");
    }

    return store;
  }

  async getProductFromShopCart(id: string) {
    const existingStore = await this.prisma.store.count({
      where: {
        id: id,
      },
    });

    if (!existingStore) {
      throw new NotFoundException("Store não encontrada");
    }

    const getCartFromShop = await this.prisma.store.findMany({
      where: {
        id: id,
      },
      select: {
        product: {
          where: {
            cart: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            image_url: true,
          },
        },
      },
    });

    if (!getCartFromShop) {
      throw new NotFoundException("Carrinho não encontrado");
    }

    return getCartFromShop;
  }
}
