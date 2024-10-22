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
  UploadedFiles,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { UpdateStore } from "./Dtos/update-store.dto";
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";

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
      image_url: upload_file[0],
    });
  }

  @Roles("admin", "user")
  @Put("/update/:id")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image_url", maxCount: 1 },
      { name: "banner_url", maxCount: 1 },
    ]),
  )
  async updateStore(
    @UploadedFiles()
    files: {
      image_url?: Express.Multer.File[];
      banner_url?: Express.Multer.File[];
    },
    @Param("id") id: string,
    @Body() updateStoreDto: UpdateStore,
  ) {
    if (!files) {
      throw new BadRequestException("Nenhum arquivo foi enviado.");
    }

    return this.storeService.updateStore({
      ...updateStoreDto,
      id: id,
      image_url: files.image_url,
      banner_url: files.banner_url,
    });
  }

  @Roles("admin")
  @Delete("/delete/:id")
  async deleteStore(@Param("id") id: string) {
    return this.storeService.deleteStoreAndRelationships(id);
  }
}
