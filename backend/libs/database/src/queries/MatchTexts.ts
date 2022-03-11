import { Describes } from '../relationships/Describes';
import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';
import { Text } from '../models/Text';

const MatchTexts = Query(
  `
    MATCH (text:${Text})-[:${CreatedBy}]->(user:${User})
    MATCH (text)-[:${Describes}]->(wikit:${Wikit})
    WHERE text.uuid IN $uuids
    RETURN text, user, wikit
  `,
  { uuids: [UUID] },
  { text: Text, user: User, wikit: Wikit }
);

export { MatchTexts };
