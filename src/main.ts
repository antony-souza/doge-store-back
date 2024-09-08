import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
  });

  const PORT = process.env.PORT || 4200;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);

  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
