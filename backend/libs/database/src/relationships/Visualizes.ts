import { Relationship } from '@wikit/neo4ogm';
import { Wikit } from '../models/Wikit';
import { Image } from '../models/Image';

const Visualizes = Relationship('VISUALIZES', [Image], [Wikit]);

export { Visualizes };
