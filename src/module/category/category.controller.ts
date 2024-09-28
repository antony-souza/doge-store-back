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
@Roles("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image_url"))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return this.categoryService.create({
      name: createCategoryDto.name,
      upload_file: upload_file,
      store_id: createCategoryDto.store_id,
    });
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(id);
  }
}
