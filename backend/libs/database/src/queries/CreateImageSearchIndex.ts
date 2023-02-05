import { Image } from '../models/Image';
import { Query } from '@wikit/neo4ogm';

const CreateImageSearchIndex = Query(
  `
    CREATE FULLTEXT INDEX search_image IF NOT EXISTS
    FOR (image:${Image}) ON EACH [image.description, image.wikit_title]
  `,
  {},
  {}
);

export { CreateImageSearchIndex };
