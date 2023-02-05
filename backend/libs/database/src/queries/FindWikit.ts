import { Describes } from '../relationships/Describes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';

const FindWikit = Query(
  `
    MATCH (wikit:${Wikit} { title: $title })
    MATCH (text:${Text})-[:${Describes}]->(wikit)
    RETURN wikit.uuid as wikit, count(text) as text_count, avg(text.rating) as average_rating
  `,
  { title: String },
  { wikit: UUID, text_count: BigInt, average_rating: Number }
);

export { FindWikit };
