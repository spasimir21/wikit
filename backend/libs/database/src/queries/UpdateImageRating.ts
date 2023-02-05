import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Image } from '../models/Image';

const UpdateImageRating = Query(
  `
    MATCH (image:${Image} { uuid: $image })
    SET image.rating = $rating
  `,
  { image: UUID, rating: Range(0, 1) },
  {}
);

export { UpdateImageRating };
