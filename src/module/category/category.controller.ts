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
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("category")
@Roles("admin", "user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post("/create")
  @UseInterceptors(FileInterceptor("image_url"))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.categoryService.create({
      name: createCategoryDto.name,
      image_url: image_url,
      store_id: createCategoryDto.store_id,
    });
  }

  @Get("/search/:id")
  findAllCategoryByStoreId(@Param("id") store_id: string) {
    const dto: UpdateCategoryDto = {
      store_id: store_id,
    }
    return this.categoryService.findAllCategoryByStoreId(dto);
  }

  @Put("/update/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.categoryService.update({
      ...updateCategoryDto,
      id: id,
      image_url: image_url,
    });
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    const dto: UpdateCategoryDto = {
      id: id
    }
    return this.categoryService.remove(dto);
  }
}
