import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { CreateUserDto } from "./Dtos/create.user.dto";
import { UpdateUserDto } from "./Dtos/update.user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/user")
@Roles("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/all")
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Post("/create")
  @UseInterceptors(FileInterceptor("image_url"))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return this.userService.createUser({
      ...createUserDto,
      image_url: upload_file,
    });
  }

  @Put("/update/:id")
  @UseInterceptors(FileInterceptor("image_url"))
  async updateUser(
    @Param("id") id: string,
    @Body() user: UpdateUserDto,
    @UploadedFile() upload_file: Express.Multer.File,
  ) {
    return this.userService.update({ ...user, id, image_url: upload_file });
  }

  @Delete("/delete/:id")
  async deleteUser(@Param() user: UpdateUserDto) {
    return this.userService.delete(user);
  }
}
