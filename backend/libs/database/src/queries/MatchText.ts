import { Describes } from '../relationships/Describes';
import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';
import { Text } from '../models/Text';

const MatchText = Query(
  `
    MATCH (text:${Text} { uuid: $uuid })-[:${CreatedBy}]->(user:${User})
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})
    RETURN text, user, wikit
  `,
  { uuid: UUID },
  { text: Text, user: User, wikit: Wikit }
);

export { MatchText };
