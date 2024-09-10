import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateStoreDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
