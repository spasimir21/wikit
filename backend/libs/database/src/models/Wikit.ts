import { Model, UUID } from '@wikit/neo4ogm';

const Wikit = Model('Wikit', {
  uuid: UUID,
  title: String
});

export { Wikit };
