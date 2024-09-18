import { ConflictException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import GeneratePasswordService from "src/util/generate-password.service";
import { CreateUserDto } from "./Dtos/create.user.dto";
import { UpdateUserDto } from "./Dtos/update.user.dto copy";

@Injectable()
export class UserService {
  private readonly generatePasswordService: GeneratePasswordService;

  constructor(private readonly prisma: PrismaService) {
    this.generatePasswordService = new GeneratePasswordService();
  }

  async findAll() {
    try {
      return await this.prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.users.findFirst({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException("User already exists");
      }

      const hashPassword = await this.generatePasswordService.createHash(
        createUserDto.password,
      );

      const createUser = await this.prisma.users.create({
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

  async update(user: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.users.count({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new ConflictException("User does not exist");
      }

      const hashPassword = await this.generatePasswordService.createHash(
        user.password,
      );
      const updateUser = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          password: hashPassword,
          role: user.role,
        },
      });

      return {
        message: "User updated successfully!",
        user: updateUser,
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async delete(user: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.users.count({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new ConflictException("User does not exist");
      }

      const deleteUser = await this.prisma.users.delete({
        where: { id: user.id },
      });

      return {
        message: "User deleted successfully!",
        user: deleteUser,
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
