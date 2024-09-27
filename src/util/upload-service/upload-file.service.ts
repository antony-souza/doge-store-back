import { Injectable } from "@nestjs/common";
import AwsUploadService from "./aws-upload.service";
import { ImgurUploadService } from "./imgur-upload.service";

type UPLOAD_SERVICE_TYPE = "AWS" | "IMGUR";

@Injectable()
export default class UploadFileFactoryService {
  private readonly UPLOAD_SERVICE_TYPE: UPLOAD_SERVICE_TYPE = "IMGUR";
  private readonly awsUploadService: AwsUploadService;
  private readonly imgurUploadService: ImgurUploadService;

  constructor() {
    if (process.env.UPLOAD_SERVICE_TYPE) {
      this.UPLOAD_SERVICE_TYPE = process.env
        .UPLOAD_SERVICE_TYPE as UPLOAD_SERVICE_TYPE;
    }

    this.awsUploadService = new AwsUploadService();
    this.imgurUploadService = new ImgurUploadService();
  }

  async upload(file: Express.Multer.File): Promise<string | undefined> {
    if (this.UPLOAD_SERVICE_TYPE === "AWS") {
      return await this.awsUploadService.upload(file);
    }

    return await this.imgurUploadService.upload(file);
  }
}
