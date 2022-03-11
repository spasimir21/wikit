import { RatingModule } from './rating.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(RatingModule);
  app.enableCors({ origin: 'http://wikit.eu' });
  await app.listen(3000);
}

bootstrap();
