import { NestFactory } from '@nestjs/core';
import { DataModule } from './data.module';

async function bootstrap() {
  const app = await NestFactory.create(DataModule);
  // app.enableCors({ origin: 'http://wikit.eu' });
  app.enableCors({ origin: ['http://wikit.eu', 'http://wikit.eu:3000'] });
  await app.listen(3000);
}

bootstrap();
