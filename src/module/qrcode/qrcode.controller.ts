import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { QrcodeService } from "./qrcode.service";
import { CreateQrcodeDto } from "./dto/create-qrcode.dto";
import { UpdateQrcodeDto } from "./dto/update-qrcode.dto";
import { JwtAuthGuard } from "src/jwt/auth.guard.service";
import { Roles, RolesGuard } from "src/database/role.service";

@Controller("/qrcode")
@Roles("admin", "user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post("/create")
  create(@Body() qrCodeData: CreateQrcodeDto) {
    return this.qrcodeService.create(qrCodeData);
  }

  @Get()
  findAll() {
    return this.qrcodeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.qrcodeService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateQrcodeDto: UpdateQrcodeDto) {
    return this.qrcodeService.update(+id, updateQrcodeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.qrcodeService.remove(+id);
  }
}
