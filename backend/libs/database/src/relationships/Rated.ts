import { Range, Relationship } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';
import { User } from '../models/User';
import { Text } from '../models/Text';

const Rated = Relationship('RATED', [User], [Text, Relation], { rating: Range(0, 1) });

export { Rated };
