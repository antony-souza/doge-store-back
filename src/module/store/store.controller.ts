import { Controller, Post, Body, Delete } from "@nestjs/common";
import { IStoreConfig, StoreService } from "./store.service";

@Controller("/store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() body: { name: string; store_config: IStoreConfig },
  ) {
    return this.storeService.createStoreAndConfig(body);
  }

  @Post("/create/categories")
  async createAndAssociateCategories(
    @Body()
    body: {
      storeId: string;
      categories: { name: string; image_url: string[] }[];
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

  @Delete("/delete/store")
  async deleteStore(
    @Body()
    body: {
      store_id: string;
    },
  ) {
    return this.storeService.deleteStoreAndRelationships(body);
  }

  /* @Delete("/delete/all/store-configs")
  async deleteAllStoreConfigs() {
    return this.storeService.deleteAllStoreConfigs();
  } */
}
