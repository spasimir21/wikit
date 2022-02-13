import { ImageModule } from './image.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(ImageModule);
  await app.listen(3000);
}

bootstrap();
