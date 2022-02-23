import { CreatedBy } from '../relationships/CreatedBy';
import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';
import { User } from '../models/User';

const CreatedRelations = Query(
  `
    MATCH (relation:${Relation})-[:${CreatedBy}]->(:${User} { uuid: $uuid })
    RETURN relation.uuid as relation
  `,
  { uuid: UUID },
  { relation: UUID }
);

export { CreatedRelations };
