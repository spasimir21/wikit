import { DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigProvider } from '@wikit/config';
import { DataResolver } from './data.resolver';
import { DataService } from './data.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    })
  ],
  providers: [ConfigProvider('./config.yml'), DatabaseProvider(models, relationships), DataService, DataResolver]
})
class DataModule {}

export { DataModule };
