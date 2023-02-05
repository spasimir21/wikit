import { CreateTextSearchIndex, CreateImageSearchIndex, DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { createImageLoader } from './image.loader';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigProvider } from '@wikit/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [SearchModule],
      useFactory: (searchService: SearchService) => ({
        autoSchemaFile: true,
        context: () => ({
          imageLoader: createImageLoader(searchService)
        })
        // playground: false
      }),
      inject: [SearchService]
    })
  ],
  providers: [ConfigProvider('./config.yml'), DatabaseProvider(models, relationships), SearchService, SearchResolver],
  exports: [SearchService]
})
class SearchModule {
  constructor(private readonly database: DatabaseConnection) {}

  async onModuleInit() {
    for (let i = 0; i < 100; i++) {
      try {
        await this.database.verifyConnection();
        break;
      } catch (error) {}
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    await this.database.run(CreateTextSearchIndex);
    await this.database.run(CreateImageSearchIndex);
  }
}

export { SearchModule };
