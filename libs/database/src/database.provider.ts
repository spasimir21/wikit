import { connect, auth, DatabaseConnection, Model, Relationship } from '@wikit/neo4ogm';
import { Config, CONFIG } from '@wikit/config';
import { Provider } from '@nestjs/common';

function DatabaseProvider(models: Model[], relationships: Relationship[]): Provider<DatabaseConnection> {
  return {
    provide: DatabaseConnection,
    useFactory: (config: Config) =>
      connect(config.database.url, auth.basic(config.database.user, config.database.password), models, relationships),
    inject: [CONFIG]
  };
}

export { DatabaseProvider };
