import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { UpdateStore } from "./Dtos/update-store.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller("/store")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles("admin", "user")
  @Get("/store-client/:id")
  async getStoreClient(@Param("id") id: string) {
    return this.storeService.getStoreClient(id);
  }

  @Roles("admin")
  @Get("/all")
  async getAllStore() {
    return this.storeService.getAllStore();
  }

  @Roles("admin")
  @Post("/create")
  @UseInterceptors(FilesInterceptor("image_url"))
  async createStore(
    @UploadedFile() upload_file: Express.Multer.File,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.createStore({
      ...createStoreDto,
      image_url: upload_file,
    });
  }

  @Roles("admin", "user")
  @Put("/update/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  async updateStore(
    @UploadedFile() upload_file: Express.Multer.File,
    @Param("id") id: string,
    @Body() updateStoreDto: UpdateStore,
  ) {
    if (!upload_file) {
      throw new BadRequestException("Nenhum arquivo foi enviado.");
    }

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
