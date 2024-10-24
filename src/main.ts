import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT_1 || 4200;

  app.useGlobalPipes(new ValidationPipe());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    next();
  });

  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
  });

  await app.listen(PORT);
  new Logger().log(`Server is Running: ${PORT}`, "SERVER");
}

bootstrap();
