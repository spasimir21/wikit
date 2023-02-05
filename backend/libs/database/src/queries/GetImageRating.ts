import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Image } from '../models/Image';
import { User } from '../models/User';

const BIAS_RATING = 0.5;
const BIAS_COUNT = 5;

const GetImageRating = Query(
  `
    MATCH (image:${Image} { uuid: $image })
    MATCH (:${User})-[rated:${Rated}]->(image)
    RETURN (sum(rated.rating) + ${BIAS_COUNT * BIAS_RATING}) / (count(rated) + ${BIAS_COUNT}) as rating
  `,
  { image: UUID },
  { rating: Range(0, 1) }
);

export { GetImageRating };
