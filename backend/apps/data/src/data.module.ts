import { DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ElasticsearchProvider } from '@wikit/elasticsearch';
import { CreationsResolver } from './creations.resolver';
import { RelationResolver } from './relation.resolver';
import { CreationsService } from './creations.service';
import { RelationService } from './relation.service';
import { WikitResolver } from './wikit.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigProvider } from '@wikit/config';
import { TextResolver } from './text.resolver';
import { WikitService } from './wikit.service';
import { TextService } from './text.service';
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
    WikitService,
    TextService,
    RelationService,
    CreationsService,
    WikitResolver,
    TextResolver,
    RelationResolver,
    CreationsResolver
  ]
})
class DataModule {}

export { DataModule };
