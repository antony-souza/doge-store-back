/* import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export default class ListAllStoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.store.findMany();
  }
}
 */
