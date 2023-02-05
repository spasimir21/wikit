import { Visualizes } from '../relationships/Visualizes';
import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Image } from '../models/Image';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const MatchImages = Query(
  `
    MATCH (image:${Image})-[:${CreatedBy}]->(user:${User})
    MATCH (image)-[:${Visualizes}]->(wikit:${Wikit})
    WHERE image.uuid IN $uuids
    RETURN image, user, wikit
  `,
  { uuids: [UUID] },
  { image: Image, user: User, wikit: Wikit }
);

export { MatchImages };
