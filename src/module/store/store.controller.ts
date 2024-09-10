import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { CreateStoreConfigDto } from "./Dtos/create-store-cofig.dto";
import { FileInterceptor } from "@nestjs/platform-express";

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
  @UseInterceptors(FileInterceptor("upload_file"))
  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() createStoreDto: CreateStoreDto,
    @Body() createStoreConfigDto: CreateStoreConfigDto,
  ) {
    return this.storeService.createStoreAndConfig(
      createStoreDto,
      createStoreConfigDto,
    );
  }

  /*  @Roles("admin")
  @Post("/create/featured-products")
  async createFeaturedProduct(
    @Body()
    body: {
      store_id: string;
      product_ids: string[];
    },
  ) {
    return this.storeService.createAndAssociateFeaturedProducts(body);
  } */

  @Roles("admin")
  @Delete("/delete/store")
  async deleteStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.deleteStoreAndRelationships(createStoreDto);
  }

  /* @Delete("/delete/all/store-configs")
  async deleteAllStoreConfigs() {
    return this.storeService.deleteAllStoreConfigs();
  } */
}
