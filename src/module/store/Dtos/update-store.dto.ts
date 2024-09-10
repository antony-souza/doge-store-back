import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreConfigDto } from "./create-store-cofig.dto";

//PartialType = Define a class extends com os campos opcionais
export class UpdateStore extends PartialType(CreateStoreConfigDto) {}
