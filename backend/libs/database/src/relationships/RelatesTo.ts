import { Relationship, UUID, Range } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';

const RelatesTo = Relationship('RELATES_TO', [Wikit], [Wikit], { uuid: UUID, rating: Range(1, 5) });

export { RelatesTo };
