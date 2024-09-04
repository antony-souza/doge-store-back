import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, Role } from "@prisma/client";

@Injectable()
export class AuthJwtService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = { id: user.id, name: user.name, role: user.role };
    return this.jwtService.sign(payload, { secret: process.env.TOKEN_KEY });
  }

  verifyToken(token: string): { id: string; name: string; role: Role } {
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
