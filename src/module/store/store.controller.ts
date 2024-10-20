import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
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
  @Get("/all")
  async getAllStore() {
    return this.storeService.getAllStore();
  }

  @Roles("admin")
  @Post("/create")
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
  @Put("/update/:id")
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

  @Roles("admin")
  @Delete("/delete/:id")
  async deleteStore(@Param("id") id: string) {
    return this.storeService.deleteStoreAndRelationships(id);
  }
}
