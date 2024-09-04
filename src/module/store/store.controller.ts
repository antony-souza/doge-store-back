import { Controller, Post, Body, Delete, UseGuards } from "@nestjs/common";
import { IProduct, IStoreConfig, StoreService } from "./store.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";

@Controller("/store")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles("admin")
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
      products: IProduct[];
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
