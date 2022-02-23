import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const CreateWikit = Query(
  `
    MATCH (user:${User}) WHERE user.uuid = $uuid
    CREATE (wikit:${Wikit} $wikit)
    MERGE (wikit)-[:${CreatedBy}]->(user)
    RETURN wikit
  `,
  { uuid: UUID, wikit: Wikit },
  { wikit: Wikit }
);

export { CreateWikit };
