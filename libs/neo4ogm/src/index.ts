import * as typesystem from './typesystem/typesystem';
import * as Relationship from './Relationship';
import * as types from './typesystem/types';
import * as type from './typesystem/type';
import * as database from './database';
import { auth } from 'neo4j-driver';
import * as Model from './Model';
import * as Query from './Query';
import * as Path from './Path';

export default {
  typesystem,
  ...Relationship,
  ...types,
  ...type,
  ...database,
  auth,
  ...Model,
  ...Query,
  ...Path
};

export * as typesystem from './typesystem/typesystem';
export { auth } from 'neo4j-driver';
export * from './typesystem/types';
export * from './typesystem/type';
export * from './Relationship';
export * from './database';
export * from './Model';
export * from './Query';
export * from './Path';
