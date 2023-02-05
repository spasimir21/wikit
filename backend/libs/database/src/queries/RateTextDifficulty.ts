import { RatedDifficulty } from '../relationships/RatedDifficulty';
import { Range, Query, UUID } from '@wikit/neo4ogm';
import { User } from '../models/User';
import { Text } from '../models/Text';

const RateTextDifficulty = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (text:${Text} { uuid: $text })
    MERGE (user)-[rated:${RatedDifficulty}]->(text)
    SET rated.difficulty = $difficulty
    RETURN rated
  `,
  { uuid: UUID, text: UUID, difficulty: Range(0, 1) },
  {}
);

export { RateTextDifficulty };
