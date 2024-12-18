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
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles("admin", "user")
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

  @Roles("admin", "user")
  @Get("/search/:storeId")
  findAll(@Param("storeId") storeId: string) {
    const productDto: UpdateProductDto = {
      store_id: storeId,
    };
    return this.productService.findMany(productDto);
  }

  @Roles("admin", "user")
  @Get("/search/:productId/:storeId")
  findOne(
    @Param("productId") productId: string,
    @Param("storeId") storeId: string,
  ) {
    const productDto: UpdateProductDto = {
      id: productId,
      store_id: storeId,
    };
    return this.productService.findOne(productDto);
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

  @Roles("admin", "user")
  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    const dto: UpdateProductDto = {
      id: id,
    };
    return this.productService.remove(dto);
  }

  @Get("/featured/:id")
  getFeaturedProducts(@Param("id") id: string) {
    return this.productService.getFeaturedProducts(id);
  }
}
