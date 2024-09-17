import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { CreateUserDto } from "./Dtos/create.user.dto";
import { UpdateUserDto } from "./Dtos/update.user.dto copy";

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
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put("/update/:id")
  async updateUser(@Body() user: UpdateUserDto) {
    return this.userService.update(user);
  }

  @Delete("/delete/:id")
  async deleteUser(@Param() user: UpdateUserDto) {
    return this.userService.delete(user);
  }
}
