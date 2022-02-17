import { Model, UUID } from '@wikit/neo4ogm';

const Text = Model('Text', {
  uuid: UUID,
  text: String,
  rating: String
});

export { Text };
