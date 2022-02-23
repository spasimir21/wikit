import { CreatedBy } from '../relationships/CreatedBy';
import { Describes } from '../relationships/Describes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';
import { User } from '../models/User';

const CreateText = Query(
  `
    MATCH (user:${User}) WHERE user.uuid = $uuid
    MATCH (wikit:${Wikit}) WHERE wikit.uuid = $wikit
    CREATE (text:${Text} $text)
    MERGE (text)-[:${CreatedBy}]->(user)
    MERGE (text)-[:${Describes}]->(wikit)
    RETURN text
  `,
  { uuid: UUID, wikit: UUID, text: Text },
  { text: Text }
);

export { CreateText };
