import { Relationship } from '@wikit/neo4ogm';
import { Token } from '../models/Token';
import { User } from '../models/User';

const Authenticates = Relationship('AUTHENTICATES', [Token], [User]);

export { Authenticates };
