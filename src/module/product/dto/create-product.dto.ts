import { IsOptional, IsString } from "class-validator";

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

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  featured_product?: string;

  image_url: Express.Multer.File;
}
