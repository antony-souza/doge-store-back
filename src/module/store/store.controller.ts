import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { IProduct, IStoreConfig, StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import ListAllStoreService from "./service/list-all-store.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/store")
@Roles("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly listAllStoreService: ListAllStoreService,
  ) {}

  @Get("/")
  async listAll() {
    return await this.listAllStoreService.all();
  }

  @Get("/search_store")
  async searchStore(@Query() query: { storeName: string }) {
    return this.storeService.getStoreByName(query);
  }

  @Post("/create/store")
  async createAndAssociateConfig(
    @Body() body: { name: string; store_config: IStoreConfig },
  ) {
    return this.storeService.createStoreAndConfig(body);
  }

  @Post("/upload_logo")
  @UseInterceptors(FileInterceptor("upload_file"))
  async upload_logo(
    @Body() body: { storeConfigId: string },
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return await this.storeService.uploadLogo(body.storeConfigId, upload_file);
  }

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
