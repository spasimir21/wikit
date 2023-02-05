import { Range, Model, UUID } from '@wikit/neo4ogm';

const Text = Model('Text', {
  uuid: UUID,
  wikit_title: String,
  text: String,
  rating: Range(0, 1),
  difficulty: Range(0, 1)
});

export { Text };
