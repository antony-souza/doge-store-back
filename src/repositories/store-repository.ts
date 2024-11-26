import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class StoreRepository {
    constructor(private readonly prisma: PrismaService){}

    async findMany() {
        return await this.prisma.store.findMany({
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                open_time: true,
                close_time: true,
                image_url: true,
                banner_url: true,
                description: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
}