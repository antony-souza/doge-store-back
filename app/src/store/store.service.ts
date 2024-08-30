import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto, CreateStoreInfoDto } from './storeDTO/store-info.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createStoreAndInfo(storeDto: CreateStoreDto, infoStoreDto: CreateStoreInfoDto) {
    try {
 
      const existingStore = await this.prisma.store.findFirst({
        where: {
          name: storeDto.name, 
        },
      });

      if (existingStore) {

        return existingStore;
      }

      const newStore = await this.prisma.store.create({
        data: {
          name: storeDto.name,
          storeInfo: {
            create: {
              image: infoStoreDto.image,
              name: storeDto.name, 
              description: infoStoreDto.description,
              isOpen: infoStoreDto.isOpen,
              location: infoStoreDto.location,
              backgroundColor: infoStoreDto.backgroundColor,
            },
          },
        },
        include: {
          storeInfo: true,
        },
      });

      return newStore;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error; 
    }
  }
}