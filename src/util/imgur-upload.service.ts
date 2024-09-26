import { Injectable } from "@nestjs/common";
import * as FormData from "form-data";
import fetch from "node-fetch";

@Injectable()
export class ImgurUploadService {
  private clientId: string = process.env.IMGUR_ID;

  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log("Imgur Client ID:", this.clientId);

    if (!file) {
      throw new Error("No file provided for upload.");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Client-ID ${this.clientId}`);

    const formdata = new FormData();
    formdata.append("image", file.buffer, file.originalname);
    formdata.append("type", "file");
    formdata.append("title", "Image Upload");
    formdata.append("description", "Uploaded via API");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      console.log("Sending image upload request to Imgur...");
      const response = await fetch(
        "https://api.imgur.com/3/image",
        requestOptions,
      );
      const result = await response.json();

      console.log("Imgur response:", result);

      if (!response.ok) {
        console.error("Error uploading image:", result.data.error);
        throw new Error(result.data.error);
      }

      console.log("Image uploaded successfully. Link:", result.data.link);
      return result.data.link; // Retorna o link da imagem
    } catch (error) {
      console.error("Failed to upload image to Imgur:", error.message);
      throw new Error("Failed to upload image to Imgur: " + error.message);
    }
  }
}
