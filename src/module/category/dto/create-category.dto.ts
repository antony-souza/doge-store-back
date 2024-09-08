import { IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  upload_file: Express.Multer.File;
}
