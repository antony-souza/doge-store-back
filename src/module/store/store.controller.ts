import {
  Controller,
  Post,
  Body,
  Delete,
  Query,
  Get,
  UseGuards,
} from "@nestjs/common";
import { IProduct, IStoreConfig, StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";

@Controller("/store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("/find")
  async getAllStores(@Query() query: { name: string }) {
    return this.storeService.getAllStores(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() body: { name: string; store_config: IStoreConfig },
  ) {
    return this.storeService.createStoreAndConfig(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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
