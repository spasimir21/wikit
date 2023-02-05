import { RelatesTo } from '../relationships/RelatesTo';
import { Describes } from '../relationships/Describes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';

const RELATION_RATING_WEIGHT = 1;
const TEXT_RATING_WEIGHT = 1;
const TEXT_DIFFICULTY_WEIGHT = 1;

const SearchSubTexts = Query(
  `
    CALL db.index.fulltext.queryNodes("search_text", $query) YIELD node AS text, score
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})-[relatesTo:${RelatesTo}]->(:${Wikit} { uuid: $parent })
    RETURN text, wikit, relatesTo, (text.rating * ${TEXT_RATING_WEIGHT} + relatesTo.rating * ${RELATION_RATING_WEIGHT} + (1 - abs(text.difficulty - $target_text_difficulty)) * ${TEXT_DIFFICULTY_WEIGHT}) * score AS score
  `,
  { parent: UUID, query: String, target_text_difficulty: Number },
  { text: Text, wikit: Wikit, relatesTo: RelatesTo, score: Number }
);

export { SearchSubTexts };
