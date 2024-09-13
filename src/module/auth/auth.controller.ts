import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./Dto/crerate.auth.dto";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async authenticateUser(@Body() auth: CreateAuthDto) {
    return this.authService.authUser(auth);
  }
}
