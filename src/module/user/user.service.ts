import { ConflictException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import GeneratePasswordService from "src/util/generate-password.service";
import { CreateUserDto } from "./Dtos/create.user.dto";

@Injectable()
export class UserService {
  private readonly generatePasswordService: GeneratePasswordService;

  constructor(private readonly prisma: PrismaService) {
    this.generatePasswordService = new GeneratePasswordService();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException("User already exists");
      }

      const hashPassword = await this.generatePasswordService.createHash(
        createUserDto.password,
      );

      const createUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashPassword,
          role: createUserDto.role as Role,
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
