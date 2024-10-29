import { Controller, Get, Param, Put, Query } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller("/public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("/search/")
  async searchStore(@Query("name") name: string) {
    return this.publicService.getStoreByName(name);
  }

  @Get("/cart/:id")
  getProductFromShopCart(@Param("id") id: string) {
    return this.publicService.getProductFromShopCart(id);
  }

  @Put("/cart/update/:id")
  setProductFromShopCart(@Param("id") id: string) {
    return this.publicService.setProductFromShopCart(id);
  }
}
