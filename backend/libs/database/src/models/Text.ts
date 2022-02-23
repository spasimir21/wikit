import { Range, Model, UUID } from '@wikit/neo4ogm';

const Text = Model('Text', {
  uuid: UUID,
  text: String,
  rating: Range(1, 5)
});

export { Text };