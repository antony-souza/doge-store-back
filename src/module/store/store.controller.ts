import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  Request,
  UploadedFile,
  Put,
  Param,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateStore } from "./Dtos/update-store.dto";

@Controller("/store")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles("admin", "user")
  @Get("/store-client/:id")
  async getStoreClient(@Request() req) {
    const store_id: string = req.user.store_id;

    return this.storeService.getStoreClient(store_id);
  }

  @Roles("admin")
  @Get("/search_store")
  async searchStore(@Query() query: { name: string }) {
    return this.storeService.getStoreByName(query);
  }

  @Roles("admin")
  @Post("/create/store")
  @UseInterceptors(FileInterceptor("image_url"))
  async createStore(
    @UploadedFile() upload_file: Express.Multer.File,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.createStore({
      ...createStoreDto,
      image_url: upload_file,
    });
  }

  @Roles("admin")
  @Put("/update/store/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  async updateStore(
    @UploadedFile() upload_file: Express.Multer.File,
    @Param("id") id: string,
    @Body() updateStoreDto: UpdateStore,
  ) {
    return this.storeService.updateStore({
      ...updateStoreDto,
      id: id,
      image_url: upload_file,
    });
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
