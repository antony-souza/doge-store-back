import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';

export class StoreDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ConfigStoreDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsBoolean()
  isOpen: boolean;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  backgroundColor: string;
}
