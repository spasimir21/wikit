import { Relationship } from '@wikit/neo4ogm';
import { Relation } from '../models/Relation';
import { Wikit } from '../models/Wikit';

const ChildRelation = Relationship('CHILD_RELATION', [Wikit], [Relation]);

export { ChildRelation };
