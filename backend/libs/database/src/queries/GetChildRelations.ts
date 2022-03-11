import { ParentRelation } from '../relationships/ParentRelation';
import { Relation } from '../models/Relation';
import { Query, UUID } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';

const GetChildRelations = Query(
  `
    MATCH (parent:${Wikit} { uuid: $parent })
    MATCH (parent)-[:${ParentRelation}]->(relation:${Relation})
    RETURN relation
  `,
  { parent: UUID },
  { relation: Relation }
);

export { GetChildRelations };
