import { Describes } from '../relationships/Describes';
import { Wikit } from '../models/Wikit';
import { Query } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const SearchRootText = Query(
  `
    CALL db.index.fulltext.queryNodes("search", $query) YIELD node AS text, score
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})
    RETURN text, wikit
    ORDER BY text.rating * score DESC
    LIMIT 1
  `,
  { query: String },
  { text: Text, wikit: Wikit }
);

export { SearchRootText };
