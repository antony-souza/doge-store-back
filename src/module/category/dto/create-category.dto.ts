import { IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  store_id: string;

  upload_file: Express.Multer.File;
}
