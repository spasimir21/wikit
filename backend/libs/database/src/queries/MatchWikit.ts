import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const MatchWikit = Query(
  `
    MATCH (wikit:${Wikit} { uuid: $uuid })-[:${CreatedBy}]->(user:${User})
    RETURN wikit, user
  `,
  { uuid: UUID },
  { wikit: Wikit, user: User }
);

export { MatchWikit };
