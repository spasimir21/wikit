import { RatedDifficulty } from '../relationships/RatedDifficulty';
import { CreatedBy } from '../relationships/CreatedBy';
import { Describes } from '../relationships/Describes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';
import { User } from '../models/User';

const CreateText = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (wikit:${Wikit} { uuid: $wikit })
    CREATE (text:${Text} $text)
    SET text.wikit_title = wikit.title, text.rating = 0.5
    CREATE (text)-[:${CreatedBy}]->(user)
    CREATE (user)-[ratedDifficulty:${RatedDifficulty} { difficulty: $text.difficulty }]->(text)
    CREATE (text)-[:${Describes}]->(wikit)
    RETURN text
  `,
  { uuid: UUID, wikit: UUID, text: Text },
  { text: Text }
);

export { CreateText };
