import { Query } from '@wikit/neo4ogm';
import { User } from '../models/User';

const MatchUser = Query(
  `
    MATCH (user:${User})
    WHERE user.username = $username
    OR user.email = $email
    RETURN user
  `,
  { username: String, email: String },
  { user: User }
);

export { MatchUser };
