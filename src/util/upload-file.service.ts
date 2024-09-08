import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export default class UploadFileService {
  private readonly AWS_S3_BUCKET = "duckdevivery";
  private readonly AWS_S3_REGION = "us-east-1";
  private readonly expiresIn = 99999;

  async upload(file: Express.Multer.File) {
    const s3Client = new S3Client({
      region: this.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_KEY ?? " ",
      },
    });

    const fileKey = `${new Date().getTime()}-${file.originalname}`;

    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: this.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file.buffer,
      }),
    );

    if (response.$metadata.httpStatusCode == 200) {
      const command = new GetObjectCommand({
        Bucket: this.AWS_S3_BUCKET,
        Key: fileKey,
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: this.expiresIn,
      });

      return url;
    }

    return undefined;
  }
}
