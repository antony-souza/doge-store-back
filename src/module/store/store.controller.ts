import { Controller, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { ConfigStoreDto, StoreDto } from './storeDTO/store-info.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  async createStoreAndInfo(
    @Body() storeDto: StoreDto,
    storeConfigDtos: ConfigStoreDto,
  ) {
    return this.storeService.createStoreAndConfig(storeDto, storeConfigDtos);
  }
}
