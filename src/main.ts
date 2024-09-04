import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
  });

  const PORT = process.env.PORT || 4200;
  await app.listen(PORT);

  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
