import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Image } from '../models/Image';
import { User } from '../models/User';

const RateImage = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (image:${Image} { uuid: $image })
    MERGE (user)-[rated:${Rated}]->(image)
    SET rated.rating = $rating
    RETURN rated
  `,
  { uuid: UUID, image: UUID, rating: Range(0, 1) },
  {}
);

export { RateImage };
