import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.enableCors({
    origin: [
      "https://doge-store-front.vercel.app",
      "https://antony-souza.online",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  });

  const PORT = process.env.PORT_1 || 4200;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
