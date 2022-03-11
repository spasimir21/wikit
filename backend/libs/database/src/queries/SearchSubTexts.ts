import { RelatesTo } from '../relationships/RelatesTo';
import { Describes } from '../relationships/Describes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';

const SearchSubTexts = Query(
  `
    CALL db.index.fulltext.queryNodes("search", $query) YIELD node AS text, score
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})-[relatesTo:${RelatesTo}]->(:${Wikit} { uuid: $parent })
    RETURN text, wikit, relatesTo, text.rating * relatesTo.rating * score AS score
  `,
  { parent: UUID, query: String },
  { text: Text, wikit: Wikit, relatesTo: RelatesTo, score: Number }
);

export { SearchSubTexts };
