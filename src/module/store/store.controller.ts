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
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { CreateStoreDto } from "./Dtos/create-store.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImgurUploadService } from "src/util/imgur-upload.service";

@Controller("/store")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly imgurUploadService: ImgurUploadService,
  ) {}

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
  @UseInterceptors(FileInterceptor("upload_file")) // Certifique-se de que o nome aqui é o mesmo do Postman
  async createStore(
    @UploadedFile() upload_file: Express.Multer.File,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    if (!upload_file) {
      throw new Error("No file provided for upload."); // Verifique se o arquivo foi enviado
    }

    // Faz o upload da imagem para o Imgur
    const imageUrl = await this.imgurUploadService.uploadImage(upload_file);

    // Atualiza a URL da imagem no DTO
    createStoreDto.image_url = imageUrl;

    // Salva a loja no banco de dados
    return this.storeService.createStore(createStoreDto);
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
