import { Visualizes } from '../relationships/Visualizes';
import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Image } from '../models/Image';
import { User } from '../models/User';

const MatchImage = Query(
  `
    MATCH (image:${Image} { uuid: $uuid })-[:${CreatedBy}]->(user:${User})
    MATCH (image)-[:${Visualizes}]->(wikit:${Wikit})
    RETURN image, user, wikit
  `,
  { uuid: UUID },
  { image: Image, user: User, wikit: Wikit }
);

export { MatchImage };
