import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "https://doge-store-front.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const PORT = process.env.PORT_1 || 4200;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
