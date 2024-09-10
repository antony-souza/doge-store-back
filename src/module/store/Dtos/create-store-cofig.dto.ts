import { IsOptional, IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateStoreConfigDto {
  @IsString()
  @IsNotEmpty()
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

  upload_file: Express.Multer.File;
}
