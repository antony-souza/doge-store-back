import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository {
  constructor() {}

  async create() {
    return "Create category";
  }

  async findAll() {
    return "Find all categories";
  }

  async findOne() {
    return "Find one category";
  }
}
