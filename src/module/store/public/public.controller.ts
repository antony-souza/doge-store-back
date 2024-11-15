import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicService } from "./public.service";
import { UpdateCategoryDto } from "src/module/category/dto/update-category.dto";

@Controller("/public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("/search/")
  async searchStore(@Query("name") name: string) {
    return this.publicService.getStoreByName(name);
  }

  //teste Http Angular
  @Get("/stores")
  async getAllStores() {
    return this.publicService.getAllStores();
  }

  @Get("/search/product/:categoryId/:storeId")
  getAllProductsByCategoryId(
    @Param("categoryId") categoryId: string,
    @Param("storeId") storeId: string,
  ) {
    const categoryDto: UpdateCategoryDto = {
      id: categoryId,
      store_id: storeId,
    };
    return this.publicService.getAllProductsByCategoryId(categoryDto);
  }
}
