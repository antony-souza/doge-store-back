import { IsString } from "class-validator";

export class CreateQrcodeDto {
  @IsString()
  text: string;
}
