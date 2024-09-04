import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "@prisma/client";
import { Roles, RolesGuard } from "src/database/role.service";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";

@Controller("/user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles("admin")
  @Post("/create")
  async createUser(
    @Body() body: { name: string; email: string; password: string; role: Role },
  ) {
    return this.userService.createUser(body);
  }
}
