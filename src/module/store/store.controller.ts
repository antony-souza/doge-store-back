import { Controller, Post, Body } from "@nestjs/common";
import { StoreService } from "./store.service";
import { ConfigStoreDto, StoreDto } from "./storeDTO/store-info.dto";

@Controller("/store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post("/create/store")
  async createStoreAndInfo(
    @Body() body: { storeDto: StoreDto; storeConfigDto: ConfigStoreDto },
  ) {
    const { storeDto, storeConfigDto } = body;
    return this.storeService.createStoreAndConfig(storeDto, storeConfigDto);
  }

  @Post("/create/categories")
  async createAndAssociateCategories(
    @Body()
    body: {
      storeId: string;
      categories: { name: string; imageUrl: string }[];
    },
  ) {
    return this.storeService.createAndAssociateCategoriesToStore(body);
  }
}
