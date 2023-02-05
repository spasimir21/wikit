import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Text } from '../models/Text';
import { User } from '../models/User';

const BIAS_RATING = 0.5;
const BIAS_COUNT = 5;

const GetTextRating = Query(
  `
    MATCH (text:${Text} { uuid: $text })
    MATCH (:${User})-[rated:${Rated}]->(text)
    RETURN (sum(rated.rating) + ${BIAS_COUNT * BIAS_RATING}) / (count(rated) + ${BIAS_COUNT}) as rating
  `,
  { text: UUID },
  { rating: Range(0, 1) }
);

export { GetTextRating };
