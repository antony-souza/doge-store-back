// app/src/store/storeDTO/store-info.dto.ts
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class StoreInfoDto {
  @IsString()
  image: string;

  @IsUUID()
  storeId: string;

  @IsString()
  description: string;

  @IsBoolean()
  isOpen: boolean;

  @IsString()
  location: string;

  @IsString()
  backgroundColor: string;
}
