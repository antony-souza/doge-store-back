import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class UploadFileService {
  private readonly AWS_S3_BUCKET = "duckdevivery";
  private readonly AWS_S3_REGION = "us-east-1";

  async upload(file: Express.Multer.File) {
    console.log(file);

    const s3Client = new S3Client({
      region: this.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_KEY ?? " ",
      },
    });

    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: this.AWS_S3_BUCKET,
        Key: `${new Date().getTime()}-${file.originalname}`,
        Body: file.buffer,
      }),
    );

    if (response.$metadata.httpStatusCode == 200) {
      console.log(response);
    }

    // const s3Client = new S3Client({});

    // const response = new AWS.S3({
    //   accessKeyId: process.env.AWS_KEY_ID ?? "",
    //   secretAccessKey: process.env.AWS_SECRET_KEY ?? " ",
    // });
  }
}
