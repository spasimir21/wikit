import { Relationship } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';
import { User } from '../models/User';

const CreatedBy = Relationship('CREATED_BY', [Wikit, Text], [User]);

export { CreatedBy };
