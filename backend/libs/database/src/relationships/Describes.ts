import { Relationship } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Text } from '../models/Text';

const Describes = Relationship('DESCRIBES', [Text], [Wikit]);

export { Describes };
