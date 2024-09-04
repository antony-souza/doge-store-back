import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthJwtService } from "./auth.jwt.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authJwtService: AuthJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException("Token não fornecido");
    }

    const token = this.authJwtService.getToken(authorizationHeader);
    const user = this.authJwtService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException(
        "Usuário não autenticado ou token inválido",
      );
    }

    // Adiciona o usuário na request
    request.user = user;

    return true;
  }
}
