import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  store_id: string;

  @IsString()
  category_id: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  upload_file: Express.Multer.File;
}
