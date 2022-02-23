import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';

const RelationExists = Query(
  `
    MATCH (relation:${Relation} { parent: $parent, child: $child })
    RETURN relation
  `,
  { parent: UUID, child: UUID },
  { relation: Relation }
);

export { RelationExists };
