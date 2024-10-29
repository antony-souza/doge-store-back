import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
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

  @IsString()
  @IsOptional()
  featured_products?: string;

  @IsString()
  @IsOptional()
  cart?: string;

  image_url: Express.Multer.File;
}
