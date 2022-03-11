import { DatabaseProvider, models, relationships } from '@wikit/database';
import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Client as ElasticClient } from '@elastic/elasticsearch';
import { ElasticsearchProvider } from '@wikit/elasticsearch';
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
  providers: [
    ConfigProvider('./config.yml'),
    DatabaseProvider(models, relationships),
    ElasticsearchProvider,
    SearchService,
    SearchResolver
  ]
})
class SearchModule {
  constructor(private readonly elastic: ElasticClient) {}

  async onModuleInit() {
    await this.createElasticIndex('text', {
      properties: {
        wikit: { type: 'keyword', store: true },
        rating: { type: 'rank_feature' },
        text: { type: 'text' }
      }
    });
  }

  private async createElasticIndex(name: string, mappings: MappingTypeMapping) {
    if (await this.elastic.indices.exists({ index: name })) return;
    await this.elastic.indices.create({ index: name, mappings });
  }
}

export { SearchModule };
