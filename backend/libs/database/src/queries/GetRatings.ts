import { IntRange, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { User } from '../models/User';

const GetRatings = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (user)-[rated:${Rated}]->(object)
    RETURN labels(object)[0] as type, object.uuid as object, rated.rating as rating
  `,
  { uuid: UUID },
  { type: String, object: UUID, rating: IntRange(1, 100) }
);

export { GetRatings };
