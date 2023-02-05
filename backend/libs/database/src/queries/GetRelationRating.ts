import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Relation } from '../models/Relation';
import { User } from '../models/User';

const BIAS_RATING = 0.5;
const BIAS_COUNT = 5;

const GetRelationRating = Query(
  `
    MATCH (relation:${Relation} { uuid: $relation })
    MATCH (:${User})-[rated:${Rated}]->(relation)
    RETURN (sum(rated.rating) + ${BIAS_COUNT * BIAS_RATING}) / (count(rated) + ${BIAS_COUNT}) as rating
  `,
  { relation: UUID },
  { rating: Range(0, 1) }
);

export { GetRelationRating };
