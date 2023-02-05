import { Describes } from '../relationships/Describes';
import { Wikit } from '../models/Wikit';
import { Query } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const TEXT_RATING_WEIGHT = 1;
const TEXT_DIFFICULTY_WEIGHT = 1;

const SearchTextForWikit = Query(
  `
    CALL db.index.fulltext.queryNodes("search_text", $query) YIELD node AS text, score
    MATCH (wikit:${Wikit} { uuid: $wikit })
    MATCH (text)-[:${Describes}]->(wikit)
    RETURN text
    ORDER BY (text.rating * ${TEXT_RATING_WEIGHT} + (1 - abs(text.difficulty - $target_text_difficulty)) * ${TEXT_DIFFICULTY_WEIGHT}) * score DESC
    LIMIT 1
  `,
  { wikit: String, query: String, target_text_difficulty: Number },
  { text: Text }
);

export { SearchTextForWikit };
