import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Relation } from '../models/Relation';
import { User } from '../models/User';

const RateRelation = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (relation:${Relation} { uuid: $relation })
    MERGE (user)-[rated:${Rated}]->(relation)
    SET rated.rating = $rating
    RETURN rated
  `,
  { uuid: UUID, relation: UUID, rating: Range(0, 1) },
  {}
);

export { RateRelation };
