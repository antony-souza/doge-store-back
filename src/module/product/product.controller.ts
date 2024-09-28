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

@Controller("product")
@Roles("admin", "user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image_url"))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return this.productService.create({
      ...createProductDto,
      upload_file: upload_file,
    });
  }

  @Get("/search/:id")
  findAll(@Param("id") store_id: string) {
    return this.productService.findAll(store_id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(id);
  }
}
