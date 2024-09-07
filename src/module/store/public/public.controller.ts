import { Controller, Get, Query } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller("public")
export class PublicController {
  constructor(private readonly store: PublicService) {}

  @Get("/search_store")
  async searchStore(@Query() query: { storeName: string }) {
    return this.store.getStoreByName(query);
  }
}
