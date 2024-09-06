import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

export interface ICategory {
  name: string;
  image_url: string[];
}

@Injectable()
export class PublicStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStores(query: { name: string }) {
    const { name } = query;
    try {
      const store = await this.prisma.store.findMany({
        where: { name: { equals: name, mode: "insensitive" } },
        include: {
          store_config: true,
          category: true,
          product: true,
        },
      });
      return store;
    } catch (error) {
      console.error("Error getting all stores:", error);
      throw new InternalServerErrorException(
        "An error occurred while getting all stores.",
      );
    }
  }

  async getAllCategories(query: { storeName: string }): Promise<ICategory[]> {
    const { storeName } = query;

    try {
      const categories = await this.prisma.category.findMany({
        where: {
          store: {
            name: { equals: storeName, mode: "insensitive" },
          },
        },
        include: {
          product: true,
        },
      });
      return categories;
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw new InternalServerErrorException(
        "An error occurred while getting all categories.",
      );
    }
  }

  async getFeaturedProducts(query: { storeName: string }) {
    const { storeName } = query;

    try {
      const products = await this.prisma.featuredProducts.findMany({
        where: {
          store: {
            name: { equals: storeName, mode: "insensitive" },
          },
        },
        include: {
          product: true,
        },
      });

      return products;
    } catch (error) {
      console.error("Error getting featured products:", error);
      throw new InternalServerErrorException(
        "An error occurred while getting featured products.",
      );
    }
  }
}
