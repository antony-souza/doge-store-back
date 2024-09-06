import { Controller, Get, Query } from "@nestjs/common";
import { PublicStoreService } from "./public.service";

@Controller("public")
export class PublicController {
  constructor(private readonly storeService: PublicStoreService) {}

  @Get("/store")
  async getAllStores(@Query() query: { name: string }) {
    return this.storeService.getAllStores(query);
  }

  @Get("/categories")
  async getAllCategories(@Query() query: { storeName: string }) {
    return this.storeService.getAllCategories(query);
  }

  @Get("/featured-products")
  async getFeaturedProducts(@Query() query: { storeName: string }) {
    return this.storeService.getFeaturedProducts(query);
  }
}
