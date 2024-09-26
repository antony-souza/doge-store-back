import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateStoreDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  is_open: boolean;

  @IsNotEmpty()
  @IsString()
  background_color: string;

  @IsString()
  @IsOptional()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  upload_file: Express.Multer.File;
}
