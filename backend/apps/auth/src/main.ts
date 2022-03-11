import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors({ origin: 'http://wikit.eu' });
  await app.listen(3000);
}

bootstrap();
