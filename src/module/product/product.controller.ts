import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/product")
@Roles("admin", "user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/create/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  create(
    @Param("id") store_id: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return this.productService.create({
      ...createProductDto,
      image_url: upload_file,
      store_id: store_id,
    });
  }

  @Get("/search/:id")
  findAll(@Param("id") id: string) {
    return this.productService.findAll(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @Put("/update/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  update(
    @UploadedFile() upload_file: Express.Multer.File,
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update({
      ...updateProductDto,
      id: id,
      image_url: upload_file,
    });
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.productService.remove(id);
  }

  @Get("/featured/:id")
  getFeaturedProducts(@Param("id") id: string) {
    return this.productService.getFeaturedProducts(id);
  }
}
