import { Visualizes } from '../relationships/Visualizes';
import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Image } from '../models/Image';
import { User } from '../models/User';

const CreateImage = Query(
  `
    MATCH (user:${User} { uuid: $uuid })
    MATCH (wikit:${Wikit} { uuid: $wikit })
    CREATE (image:${Image} $image)
    SET image.wikit_title = wikit.title, image.rating = 0.5
    CREATE (image)-[:${CreatedBy}]->(user)
    CREATE (image)-[:${Visualizes}]->(wikit)
    RETURN image
  `,
  { uuid: UUID, wikit: UUID, image: Image },
  { image: Image }
);

export { CreateImage };
