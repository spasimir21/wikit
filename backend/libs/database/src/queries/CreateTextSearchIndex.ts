import { Query } from '@wikit/neo4ogm';
import { Text } from '../models/Text';

const CreateTextSearchIndex = Query(
  `
    CREATE FULLTEXT INDEX search_text IF NOT EXISTS
    FOR (text:${Text}) ON EACH [text.text, text.wikit_title]
  `,
  {},
  {}
);

export { CreateTextSearchIndex };
