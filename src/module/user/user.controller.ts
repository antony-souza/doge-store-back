import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { CreateUserDto } from "./Dtos/create.user.dto";

@Controller("/user")
@Roles("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
