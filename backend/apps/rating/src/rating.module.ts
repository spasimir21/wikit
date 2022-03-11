import { DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ElasticsearchProvider } from '@wikit/elasticsearch';
import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';
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
    RatingService,
    RatingResolver
  ]
})
class RatingModule {}

export { RatingModule };
