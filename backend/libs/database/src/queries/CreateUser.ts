import { Query } from '@wikit/neo4ogm';
import { User } from '../models/User';

const CreateUser = Query(`CREATE (:${User} $user)`, { user: User }, {});

export { CreateUser };
