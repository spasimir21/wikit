import { NestFactory } from '@nestjs/core';
import { DataModule } from './data.module';

async function bootstrap() {
  const app = await NestFactory.create(DataModule);
  app.enableCors({ origin: 'http://wikit.eu' });
  await app.listen(3000);
}

bootstrap();
