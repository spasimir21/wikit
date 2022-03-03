import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Relation } from '../models/Relation';

const GetRelationRating = Query(
  `
    MATCH (relation:${Relation} { uuid: $relation })
    MATCH ()-[rated:${Rated}]->(relation)
    RETURN avg(rated.rating) as rating
  `,
  { relation: UUID },
  { rating: Range(1, 100) }
);

export { GetRelationRating };
