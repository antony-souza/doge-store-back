import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 4200;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(PORT);

  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
