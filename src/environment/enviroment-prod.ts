import * as dotenv from "dotenv";
dotenv.config();
class EnvironmentProd {
    public readonly DEFAULT_USER_NAME: string = process.env.DEFAULT_USER_NAME ?? "";
    public readonly DEFAULT_USER_EMAIL: string = process.env.DEFAULT_USER_EMAIL ?? "";
    public readonly DEFAULT_USER_ROLE: string = process.env.DEFAULT_USER_ROLE ?? "";
    public readonly DEFAULT_USER_PASSWORD: string = process.env.DEFAULT_USER_PASSWORD ?? "";
    public readonly DEFAULT_USER_IMAGE_URL: string = process.env.DEFAULT_USER_IMAGE_URL ?? "";

}

export const environment = new EnvironmentProd();