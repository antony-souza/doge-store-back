import { Role } from "@prisma/client";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  role: Role;

  @IsOptional()
  @IsString()
  store_id: string;

  image_url: Express.Multer.File;
}
