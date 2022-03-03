import { IntRange, Relationship } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';
import { User } from '../models/User';
import { Text } from '../models/Text';

const Rated = Relationship('RATED', [User], [Text, Relation], { rating: IntRange(1, 100) });

export { Rated };
