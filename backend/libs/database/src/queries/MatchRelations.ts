import { CreatedBy } from '../relationships/CreatedBy';
import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';
import { User } from '../models/User';

const MatchRelations = Query(
  `
    MATCH (relation:${Relation})-[:${CreatedBy}]->(user:${User})
    WHERE relation.uuid IN $uuids
    RETURN relation, user
  `,
  { uuids: [UUID] },
  { relation: Relation, user: User }
);

export { MatchRelations };
