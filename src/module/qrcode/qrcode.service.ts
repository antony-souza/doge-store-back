import { Injectable } from "@nestjs/common";
import { CreateQrcodeDto } from "./dto/create-qrcode.dto";
import { UpdateQrcodeDto } from "./dto/update-qrcode.dto";
import * as QRCode from "qrcode";

@Injectable()
export class QrcodeService {
  async create(createQrcodeDto: CreateQrcodeDto) {
    const qrCode = await QRCode.toDataURL(createQrcodeDto.text, {
      width: 500,
      errorCorrectionLevel: "H",
      margin: 1,
      type: "image/png",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return {
      qrCodeData: qrCode,
    };
  }

  findAll() {
    return `This action returns all qrcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qrcode`;
  }

  update(id: number, updateQrcodeDto: UpdateQrcodeDto) {
    return `This action updates a #${id} qrcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} qrcode`;
  }
}
