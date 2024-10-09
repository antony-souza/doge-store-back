import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  store_id: string;

  image_url: Express.Multer.File;
}
