import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
  Query,
} from "@nestjs/common";
import { IProduct, IStoreConfig, StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";

@Controller("/store")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles("admin")
  @Get("/search_store")
  async searchStore(@Query() query: { storeName: string }) {
    return this.storeService.getStoreByName(query);
  }

  @Roles("admin")
  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() body: { name: string; store_config: IStoreConfig },
  ) {
    return this.storeService.createStoreAndConfig(body);
  }

  @Roles("admin")
  @Post("/create/categories")
  async createAndAssociateCategories(
    @Body()
    body: {
      storeId: string;
      categories: { name: string; image_url: string[]; border_color: string }[];
    },
  ) {
    return this.storeService.createAndAssociateCategoriesToStore(body);
  }

  @Roles("admin")
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

  @Roles("admin")
  @Post("/create/featured-products")
  async createFeaturedProduct(
    @Body()
    body: {
      store_id: string;
      product_ids: string[];
    },
  ) {
    return this.storeService.createAndAssociateFeaturedProducts(body);
  }

  @Roles("admin")
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
