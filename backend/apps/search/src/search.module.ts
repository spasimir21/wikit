import { CreateFullTextIndex, DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigProvider } from '@wikit/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
      // playground: false
    })
  ],
  providers: [ConfigProvider('./config.yml'), DatabaseProvider(models, relationships), SearchService, SearchResolver]
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

    await this.database.run(CreateFullTextIndex);
  }
}

export { SearchModule };
