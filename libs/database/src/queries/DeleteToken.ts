import { Authenticates } from '../relationships/Authenticates';
import { Token } from '../models/Token';
import { Query } from '@wikit/neo4ogm';
import { User } from '../models/User';

const DeleteToken = Query(
  `
    MATCH (token:${Token} { token: $token })-[rel:${Authenticates}]->(:${User})
    DELETE rel, token
  `,
  { token: String },
  {}
);

export { DeleteToken };
