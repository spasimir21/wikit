import { CreatedBy } from '../relationships/CreatedBy';
import { Query, UUID } from '@wikit/neo4ogm';
import { Text } from '../models/Text';
import { User } from '../models/User';

const CreatedTexts = Query(
  `
    MATCH (text:${Text})-[:${CreatedBy}]->(:${User} { uuid: $uuid })
    RETURN text.uuid as text
  `,
  { uuid: UUID },
  { text: UUID }
);

export { CreatedTexts };
