import { RelatesTo } from '../relationships/RelatesTo';
import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';
import { Wikit } from '../models/Wikit';

const UpdateRelationRating = Query(
  `
    MATCH (relation:${Relation} { uuid: $relation })
    MATCH (:${Wikit} { uuid: relation.child })-[relates:${RelatesTo}]->(:${Wikit} { uuid: relation.parent })
    SET relation.rating = $rating
    SET relates.rating = $rating
  `,
  { relation: UUID, rating: Range(0, 1) },
  {}
);

export { UpdateRelationRating };
