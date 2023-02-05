import { Visualizes } from '../relationships/Visualizes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Image } from '../models/Image';

const GetImagesForWikits = Query(
  `
    MATCH (image:${Image})-[:${Visualizes}]->(wikit:${Wikit})
    WHERE wikit.uuid IN $wikits
    RETURN wikit.uuid as wikit, image.uuid as image, image.rating as rating
  `,
  { wikits: [UUID] },
  { wikit: String, image: String, rating: Number }
);

export { GetImagesForWikits };
