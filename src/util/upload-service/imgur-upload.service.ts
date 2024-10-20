import { Injectable } from "@nestjs/common";
import * as FormData from "form-data";
import fetch from "node-fetch";
import { IUploadFactoryService } from "./upload-service.interface";

@Injectable()
export class ImgurUploadService implements IUploadFactoryService {
  private clientId: string = process.env.IMGUR_ID;
  private accessToken: string = process.env.IMGUR_ACCESS_TOKEN;
  private refreshToken: string = process.env.IMGUR_REFRESH_TOKEN;
  private albumId: string = process.env.IMGUR_ALBUM_ID;

  private async refreshAccessToken(): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const formdata = new URLSearchParams();
    formdata.append("refresh_token", this.refreshToken);
    formdata.append("client_id", this.clientId);
    formdata.append("grant_type", "refresh_token");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://api.imgur.com/oauth2/token",
        requestOptions,
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${result.error}`);
      }

      this.accessToken = result.access_token;
    } catch (error) {
      throw new Error("Failed to refresh access token: " + error.message);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${this.accessToken}`);

    const formdata = new FormData();
    formdata.append("image", file.buffer, file.originalname);
    formdata.append("type", "file");
    formdata.append("title", "Doge Store - Images");
    formdata.append("description", "Uploaded via API");
    formdata.append("album", this.albumId);
    formdata.append("privacy", "hidden");

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

      if (
        result.status === 403 &&
        result.data.error === "The access token provided is invalid"
      ) {
        await this.refreshAccessToken();
        return this.upload(file);
      }

      if (!response.ok) {
        throw new Error(result.data.error);
      }

      return result.data.link;
    } catch (error) {
      throw new Error("Failed to upload image to Imgur: " + error.message);
    }
  }
}
