import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  is_open: boolean;

  @IsString()
  background_color: string;

  @IsString()
  user_id: string;

  @IsOptional()
  image_url?: Express.Multer.File[];

  @IsOptional()
  banner_url?: Express.Multer.File[];
}
