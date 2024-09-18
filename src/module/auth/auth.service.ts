import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AuthJwtService } from "src/jwt/auth.jwt.service";
import * as bcrypt from "bcrypt";
import { CreateAuthDto } from "./Dto/crerate.auth.dto";
import { Users } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly AuthToken: AuthJwtService,
  ) {}
  async authUser(auth: CreateAuthDto) {
    const user = await this.prisma.users.findFirst({
      where: { email: auth.email },
    });

    if (!user || !(await bcrypt.compare(auth.password, user.password))) {
      throw new ConflictException("Invalid email or password");
    }
    const token = this.AuthToken.generateToken(user);

    return {
      token,
      message: "User authenticated successfully!",
    };
  }
  async validateToken(token: string): Promise<Users> {
    const payload = this.AuthToken.verifyToken(token);
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id },
    });
    return user;
  }
}
