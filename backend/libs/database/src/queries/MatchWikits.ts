import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const MatchWikits = Query(
  `
    MATCH (wikit:${Wikit})-[:${CreatedBy}]->(user:${User})
    WHERE wikit.uuid IN $uuids
    RETURN wikit, user
  `,
  { uuids: [UUID] },
  { wikit: Wikit, user: User }
);

export { MatchWikits };
