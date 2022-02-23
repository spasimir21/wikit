import { CreatedBy } from '../relationships/CreatedBy';
import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';
import { User } from '../models/User';

const MatchRelation = Query(
  `
    MATCH (relation:${Relation} { uuid: $uuid })-[:${CreatedBy}]->(user:${User})
    RETURN relation, user
  `,
  { uuid: UUID },
  { relation: Relation, user: User }
);

export { MatchRelation };
