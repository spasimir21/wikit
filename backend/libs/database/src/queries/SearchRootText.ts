import { Describes } from '../relationships/Describes';
import { Wikit } from '../models/Wikit';
import { Query } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const TEXT_RATING_WEIGHT = 1;
const TEXT_DIFFICULTY_WEIGHT = 1;

const SearchRootText = Query(
  `
    CALL db.index.fulltext.queryNodes("search_text", $query) YIELD node AS text, score
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})
    RETURN text, wikit
    ORDER BY (text.rating * ${TEXT_RATING_WEIGHT} + (1 - abs(text.difficulty - $target_text_difficulty)) * ${TEXT_DIFFICULTY_WEIGHT}) * score DESC
    LIMIT 1
  `,
  { query: String, target_text_difficulty: Number },
  { text: Text, wikit: Wikit }
);

export { SearchRootText };
