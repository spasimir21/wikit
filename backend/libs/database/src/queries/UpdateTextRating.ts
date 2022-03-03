import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const UpdateTextRating = Query(
  `
    MATCH (text:${Text} { uuid: $text })
    SET text.rating = $rating
  `,
  { text: UUID, rating: Range(1, 100) },
  {}
);

export { UpdateTextRating };
