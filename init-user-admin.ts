// import { PrismaService } from "src/database/prisma.service";

import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import GeneratePasswordService from "src/util/generate-password.service";
import * as bcrypt from "bcrypt";

export class PrismaInitialService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

async function main() {
  const prismaService = new PrismaInitialService();

  const userDefault: User = {
    name: "Admin Duck",
    email: "admin@duck.com",
    role: "admin",
    id: "1",
    password: "",
    created_at: undefined,
    updated_at: undefined,
  };

  const checkIfExistUser = await prismaService.user.count({
    where: {
      name: userDefault.name,
      email: userDefault.email,
      role: userDefault.role,
    },
  });

  if (!checkIfExistUser) {
    const hashedPassword = await bcrypt.hash("12345678", 11);

    await prismaService.user.create({
      data: {
        ...userDefault,
        password: hashedPassword,
      },
    });

    new Logger().debug("User Created With Success", "Populate");
    return;
  }

  new Logger().debug("User Already Exist", "Populate");
}

main();