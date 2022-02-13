import { Token } from '../models/Token';
import { Query } from '@wikit/neo4ogm';

const MatchToken = Query(
  `
    MATCH (token:${Token} { token: $token, refreshToken: $refreshToken })
    RETURN token
  `,
  { token: String, refreshToken: String },
  { token: Token }
);

export { MatchToken };
