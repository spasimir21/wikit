import { Range, Relationship } from '@wikit/neo4ogm';
import { User } from '../models/User';
import { Text } from '../models/Text';

const RatedDifficulty = Relationship('RATED_DIFFICULTY', [User], [Text], { difficulty: Range(0, 1) });

export { RatedDifficulty };
