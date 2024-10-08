import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  store_id: string;

  @IsString()
  category_id: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  upload_file: Express.Multer.File;
}
