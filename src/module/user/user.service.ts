import { ConflictException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import GeneratePasswordService from "src/util/generate-password.service";

@Injectable()
export class UserService {
  private readonly generatePasswordService: GeneratePasswordService;

  constructor(private readonly prisma: PrismaService) {
    this.generatePasswordService = new GeneratePasswordService();
  }

  async createUser(body: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    try {
      const { name, email, password, role } = body;

      // Verifica se o usuário já existe pelo e-mail
      const existingUser = await this.prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException("User already exists");
      }

      const hashPassword =
        await this.generatePasswordService.createHash(password);

      const createUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          role,
        },
      });

      return {
        message: "User created successfully!",
        user: createUser,
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
