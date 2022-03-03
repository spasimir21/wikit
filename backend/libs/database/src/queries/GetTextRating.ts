import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Text } from '../models/Text';

const GetTextRating = Query(
  `
    MATCH (text:${Text} { uuid: $text })
    MATCH ()-[rated:${Rated}]->(text)
    RETURN avg(rated.rating) as rating
  `,
  { text: UUID },
  { rating: Range(1, 100) }
);

export { GetTextRating };
