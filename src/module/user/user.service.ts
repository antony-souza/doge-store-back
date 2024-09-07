import { ConflictException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

      const salt = await bcrypt.genSalt(11);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cria o usuário com a senha criptografada
      const createUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
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
