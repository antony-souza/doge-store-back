import { Controller, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, CreateStoreInfoDto } from './storeDTO/store-info.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create') 
  async createStoreAndInfo(
    @Body() storeDto: CreateStoreDto,
    @Body() infoStoreDto: CreateStoreInfoDto,
  ) {
    return this.storeService.createStoreAndInfo(storeDto, infoStoreDto);
  }
};
