import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const CreatedWikits = Query(
  `
    MATCH (wikit:${Wikit})-[:${CreatedBy}]->(:${User} { uuid: $uuid })
    RETURN wikit.uuid as wikit
  `,
  { uuid: UUID },
  { wikit: UUID }
);

export { CreatedWikits };
