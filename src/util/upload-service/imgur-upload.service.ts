import { Injectable } from "@nestjs/common";
import * as FormData from "form-data";
import fetch from "node-fetch";
import { IUploadFactoryService } from "./upload-service.interface";

@Injectable()
export class ImgurUploadService implements IUploadFactoryService {
  private clientId: string = process.env.IMGUR_ID;

  async upload(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Client-ID ${this.clientId}`);

    const formdata = new FormData();
    formdata.append("image", file.buffer, file.originalname);
    formdata.append("type", "file");
    formdata.append("title", "Doge Store - Images");
    formdata.append("description", "Uploaded via API");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://api.imgur.com/3/image",
        requestOptions,
      );
      const result = await response.json();

      console.log("Imgur response:", result);

      if (!response.ok) {
        throw new Error(result.data.error);
      }
      return result.data.link;
    } catch (error) {
      throw new Error("Failed to upload image to Imgur: " + error.message);
    }
  }
}
