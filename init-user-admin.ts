// import { PrismaService } from "src/database/prisma.service";

import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient, Users } from "@prisma/client";
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

  const userDefault: Users = {
    name: "Admin Duck",
    email: "admin@duck.com",
    role: "admin",
    id: "1",
    password: "",
    image_url: "https://i.imgur.com/9NafuhL.jpeg",
    store_id: undefined,
    created_at: undefined,
    updated_at: undefined,
  };

  const checkIfExistUser = await prismaService.users.count({
    where: {
      name: userDefault.name,
      email: userDefault.email,
      role: userDefault.role,
    },
  });

  if (!checkIfExistUser) {
    const hashedPassword = await bcrypt.hash("12345678", 11);

    await prismaService.users.create({
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
