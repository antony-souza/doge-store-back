import { Injectable } from '@nestjs/common';
import PrismaService from '../../prisma/prisma.service';
import { CreateStoreDto } from './storeDTO/create-store.dto';

@Injectable()
export class StoreService {
  private storeDto: CreateStoreDto;
  constructor(private readonly prismaService: PrismaService) {}

  async createStore(storeDto: CreateStoreDto) {
    this.storeDto = storeDto;
  }
}
