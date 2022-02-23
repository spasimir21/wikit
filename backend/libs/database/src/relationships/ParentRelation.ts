import { Relationship } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';
import { Wikit } from '../models/Wikit';

const ParentRelation = Relationship('PARENT_RELATION', [Wikit], [Relation]);

export { ParentRelation };
