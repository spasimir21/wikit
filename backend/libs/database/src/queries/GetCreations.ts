import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { User } from '../models/User';

const GetCreations = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (creation)-[:${CreatedBy}]->(user)
    RETURN labels(creation)[0] as type, creation.uuid as uuid
  `,
  { uuid: UUID },
  { type: String, uuid: UUID }
);

export { GetCreations };
