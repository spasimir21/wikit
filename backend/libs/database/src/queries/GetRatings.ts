import { RatedDifficulty } from '../relationships/RatedDifficulty';
import { Range, Query, UUID } from '@wikit/neo4ogm';
import { Rated } from '../relationships/Rated';
import { Relation } from '../models/Relation';
import { Image } from '../models/Image';
import { User } from '../models/User';

const GetRatings = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (user)-[rated]->(object)
    WHERE rated:${Rated} OR rated:${RatedDifficulty}
    RETURN object.uuid as object,
      (CASE
        WHEN object:${Relation} THEN 'RELATION'
        WHEN object:${Image} THEN 'IMAGE'
        WHEN rated:${RatedDifficulty} THEN 'TEXT_DIFFICULTY'
        ELSE 'TEXT'
      END) as type,
      (CASE
        WHEN rated:${Rated} THEN rated.rating
        WHEN rated:${RatedDifficulty} THEN rated.difficulty
        ELSE 0
      END) as rating
  `,
  { uuid: UUID },
  { type: String, object: UUID, rating: Range(0, 1) }
);

export { GetRatings };
