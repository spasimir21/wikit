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
    MATCH (user:${User} { uuid: $uuid })
    MATCH (parent:${Wikit} { uuid: $parent })
    MATCH (child:${Wikit} { uuid: $child })
    CREATE (relation:${Relation} $relation)
    SET relation.rating = 0.5
    CREATE (relation)-[:${CreatedBy}]->(user)
    CREATE (child)-[:${RelatesTo} { uuid: $relation.uuid, rating: 0.5 }]->(parent)
    CREATE (parent)-[:${ParentRelation}]->(relation)
    CREATE (child)-[:${ChildRelation}]->(relation)
    RETURN relation
  `,
  { uuid: UUID, parent: UUID, child: UUID, relation: Relation },
  { relation: Relation }
);

export { CreateRelation };
