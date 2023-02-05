import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { User } from '../models/User';
import { Text } from '../models/Text';

const RateText = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (text:${Text} { uuid: $text })
    MERGE (user)-[rated:${Rated}]->(text)
    SET rated.rating = $rating
    RETURN rated
  `,
  { uuid: UUID, text: UUID, rating: Range(0, 1) },
  {}
);

export { RateText };
