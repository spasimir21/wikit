import { Range, Model, UUID } from '@wikit/neo4ogm';

const Relation = Model('Relation', {
  uuid: UUID,
  parent: UUID,
  child: UUID,
  rating: Range(1, 5)
});

export { Relation };
