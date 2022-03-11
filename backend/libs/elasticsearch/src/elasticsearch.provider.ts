import { Client } from '@elastic/elasticsearch';
import { Config, CONFIG } from '@wikit/config';
import { Provider } from '@nestjs/common';

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ElasticsearchProvider: Provider<Promise<Client>> = {
  provide: Client,
  useFactory: async (config: Config) => {
    const client = new Client({
      node: config.elasticsearch.node,
      auth: {
        username: config.elasticsearch.user,
        password: config.elasticsearch.password
      }
    });

    for (let i = 0; i < 1000; i++) {
      try {
        await client.cluster.health({ wait_for_status: 'yellow' });
        return client;
      } catch (error) {}
      await wait(10000);
    }

    throw new Error('Failed to connect to Elasticsearch!');
  },
  inject: [CONFIG]
};

export { ElasticsearchProvider };
