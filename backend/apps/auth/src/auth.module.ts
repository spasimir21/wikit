import { AuthController } from './auth.controller';
import { DatabaseProvider } from '@wikit/database';
import { relationships } from '@wikit/database';
import { ConfigProvider } from '@wikit/config';
import { AuthService } from './auth.service';
import { models } from '@wikit/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [ConfigProvider('./config.yml'), DatabaseProvider(models, relationships), AuthService]
})
class AuthModule {}

export { AuthModule };
