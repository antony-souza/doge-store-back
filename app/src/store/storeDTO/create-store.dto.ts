import {IsOptional, IsString, IsUUID} from "class-validator";

export class CreateStoreDto {
  @IsUUID()
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  name: string
}