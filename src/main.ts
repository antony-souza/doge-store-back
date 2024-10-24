import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT_1 || 4200;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ["https://doge-store-front.vercel.app", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  });

  await app.listen(PORT);
  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
