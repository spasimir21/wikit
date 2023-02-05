import { SearchModule } from './search.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  // app.enableCors({ origin: 'http://wikit.eu' });
  app.enableCors({ origin: ['http://wikit.eu', 'http://wikit.eu:3000'] });
  await app.listen(3000);
}

bootstrap();
