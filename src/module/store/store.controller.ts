import { Controller, Post, Body } from "@nestjs/common";
import { StoreService } from "./store.service";
import { ConfigStoreDto, StoreDto } from "./storeDTO/store-info.dto";

@Controller("/store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() body: { storeDto: StoreDto; storeConfigDto: ConfigStoreDto },
  ) {
    const { storeDto, storeConfigDto } = body;
    return this.storeService.createAndAssociateConfigToStore(
      storeDto,
      storeConfigDto,
    );
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

  @Post("/create/product")
  async createAndAssociateProduct(
    @Body()
    body: {
      store_id: string;
      products: {
        name: string;
        price: number;
        image_url: string[];
        category_id: string;
      }[];
    },
  ) {
    return this.storeService.createAndAssociateProductToStore(body);
  }
}
