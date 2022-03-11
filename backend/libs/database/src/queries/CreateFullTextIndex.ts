import { Query } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const CreateFullTextIndex = Query(
  `
    CREATE FULLTEXT INDEX search IF NOT EXISTS
    FOR (text:${Text}) ON EACH [text.text]
  `,
  {},
  {}
);

export { CreateFullTextIndex };
