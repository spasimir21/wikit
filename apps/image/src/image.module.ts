import { ImageController } from './image.controller';
import { ConfigProvider } from '@wikit/config';
import { ImageService } from './image.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [ConfigProvider('./config.yml'), ImageService]
})
class ImageModule {}

export { ImageModule };
