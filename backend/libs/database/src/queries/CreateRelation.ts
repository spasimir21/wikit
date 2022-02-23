import { ParentRelation } from '../relationships/ParentRelation';
import { ChildRelation } from '../relationships/ChildRelation';
import { RelatesTo } from '../relationships/RelatesTo';
import { CreatedBy } from '../relationships/CreatedBy';
import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { User } from '../models/User';

const CreateRelation = Query(
  `
    MATCH (user:${User}) WHERE user.uuid = $uuid
    MATCH (parent:${Wikit}) WHERE parent.uuid = $parent
    MATCH (child:${Wikit}) WHERE child.uuid = $child
    CREATE (relation:${Relation} $relation)
    MERGE (relation)-[:${CreatedBy}]->(user)
    MERGE (child)-[:${RelatesTo} { uuid: $relation.uuid, rating: 1 }]->(parent)
    MERGE (parent)-[:${ParentRelation}]->(relation)
    MERGE (child)-[:${ChildRelation}]->(relation)
    RETURN relation
  `,
  { uuid: UUID, parent: UUID, child: UUID, relation: Relation },
  { relation: Relation }
);

export { CreateRelation };
