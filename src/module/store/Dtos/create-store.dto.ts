import { IsOptional, IsString } from "class-validator";

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
  is_open: string;

  @IsString()
  background_color: string;

  @IsString()
  user_id: string;

  @IsOptional()
  image_url?: Express.Multer.File[];

  @IsOptional()
  banner_url?: Express.Multer.File[];
}
