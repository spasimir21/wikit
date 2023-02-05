import { Visualizes } from '../relationships/Visualizes';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';

const SearchImagesForWikits = Query(
  `
    CALL db.index.fulltext.queryNodes("search_image", $query) YIELD node AS image, score
    MATCH (image)-[:${Visualizes}]->(wikit:${Wikit})
    WHERE wikit.uuid IN $wikits
    RETURN wikit.uuid as wikit, image.uuid as image, score
  `,
  { query: String, wikits: [UUID] },
  { wikit: String, image: String, score: Number }
);

export { SearchImagesForWikits };
