import { Model, UUID } from '@wikit/neo4ogm';

const User = Model('User', {
  uuid: UUID,
  username: String,
  email: String,
  password: String
});

export { User };
