import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export default class ListAllStoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.store.findMany({
      select: {
        id: true,
        name: true,
        store_config: {
          select: {
            description: true,
            image_url: true,
            background_color: true,
          },
        },
      },
    });
  }
}
