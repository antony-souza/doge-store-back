import { Injectable } from "@nestjs/common";
import { StoreService } from "../store.service";

@Injectable()
export class PublicService extends StoreService {}
