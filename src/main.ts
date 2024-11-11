import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT_1);
  new Logger().log(`Server is Running: ${process.env.PORT_1}`, "SERVER");
}

bootstrap();
