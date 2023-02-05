import { Authenticates } from '../relationships/Authenticates';
import { Query, UUID } from '@wikit/neo4ogm';
import { Token } from '../models/Token';
import { User } from '../models/User';

const CreateToken = Query(
  `
    MATCH (user:${User}) WHERE user.uuid = $uuid
    CREATE (token:${Token} $token)
    CREATE (token)-[:${Authenticates}]->(user)
  `,
  { token: Token, uuid: UUID },
  {}
);

export { CreateToken };
