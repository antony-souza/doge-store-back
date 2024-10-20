import { Controller, Get, Query } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller("/public")
export class PublicController {
  constructor(private readonly store: PublicService) {}

  @Get("/search/")
  async searchStore(@Query("name") name: string) {
    return this.store.getStoreByName(name);
  }
}
