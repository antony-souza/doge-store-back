import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Users, Role } from "@prisma/client";

@Injectable()
export class AuthJwtService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: Users): string {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      store_id: user.store_id,
    };
    return this.jwtService.sign(payload, { secret: process.env.TOKEN_KEY });
  }

  verifyToken(token: string): {
    id: string;
    name: string;
    role: Role;
    store_id: string;
  } {
    try {
      return this.jwtService.verify(token, { secret: process.env.TOKEN_KEY });
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      throw new UnauthorizedException("Token inválido");
    }
  }

  getToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException("Token não fornecido");
    }

    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException(
        "Tipo de token inválido ou token não fornecido",
      );
    }
    return token;
  }
}
