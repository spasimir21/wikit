import { RatedDifficulty } from '../relationships/RatedDifficulty';
import { CreatedBy } from '../relationships/CreatedBy';
import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Text } from '../models/Text';
import { User } from '../models/User';

const BIAS_COUNT = 4;

const GetTextDifficulty = Query(
  `
    MATCH (text:${Text} { uuid: $text })-[:${CreatedBy}]->(creator:${User})
    MATCH (creator)-[originalRated:${RatedDifficulty}]->(text)
    MATCH (:${User})-[rated:${RatedDifficulty}]->(text)
    RETURN (sum(rated.difficulty) + ${BIAS_COUNT} * originalRated.difficulty) / (count(rated) + ${BIAS_COUNT}) as difficulty
  `,
  { text: UUID },
  { difficulty: Range(0, 1) }
);

export { GetTextDifficulty };
