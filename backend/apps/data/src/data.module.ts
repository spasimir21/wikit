import { DatabaseProvider, models, relationships } from '@wikit/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CreationsResolver } from './creations.resolver';
import { RelationResolver } from './relation.resolver';
import { CreationsService } from './creations.service';
import { RelationService } from './relation.service';
import { ImageResolver } from './image.resolver';
import { WikitResolver } from './wikit.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigProvider } from '@wikit/config';
import { ImageService } from './image.service';
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
    WikitService,
    TextService,
    RelationService,
    ImageService,
    CreationsService,
    WikitResolver,
    TextResolver,
    RelationResolver,
    ImageResolver,
    CreationsResolver
  ]
})
class DataModule {}

export { DataModule };
