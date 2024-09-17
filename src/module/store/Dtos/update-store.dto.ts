import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreDto } from "./create-store.dto";

//PartialType = Define a class extends com os campos opcionais
export class UpdateStore extends PartialType(CreateStoreDto) {}
