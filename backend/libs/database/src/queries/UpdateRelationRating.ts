import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';

const UpdateRelationRating = Query(
  `
    MATCH (relation:${Relation} { uuid: $relation })
    SET relation.rating = $rating
  `,
  { relation: UUID, rating: Range(1, 100) },
  {}
);

export { UpdateRelationRating };
